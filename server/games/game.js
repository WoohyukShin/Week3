// server/games/game.js
const GAME_CONSTANTS = require('../constants/constants');
const SkillManager = require('./SkillManager');

class Game {
  constructor(roomId, players, io) {
    this.roomId = roomId;
    this.players = players; // Player 객체의 배열
    this.io = io; // Socket.io 인스턴스
    
    this.gameInterval = null; // 게임 루프의 setInterval ID
    this.isManagerAppeared = false; // '운영진' 등장 여부
  }

  // 게임 시작
  start() {
    // 각 플레이어에게 랜덤 스킬 할당
    this.players.forEach(player => {
      SkillManager.assignRandomSkill(player);
    });

    // 게임 상태 초기화 및 클라이언트에 전송
    this.broadcast('gameStarted', this.getGameState());

    // 게임 루프 시작
    this.gameInterval = setInterval(() => this.tick(), GAME_CONSTANTS.GAME_TICK_INTERVAL);
  }

  // 게임 루프 (매 틱마다 실행)
  tick() {
    // 1. '운영진' 등장 이벤트 처리
    this.handleManagerEvent();

    // 2. 각 플레이어 상태 업데이트
    this.players.forEach(player => {
      if (!player.isAlive) return;
      this.updatePlayerGauges(player);
      this.checkPlayerStatus(player);
    });

    // 3. 게임 상태 변경사항 전파
    this.broadcast('gameStateUpdate', this.getGameState());

    // 4. 게임 종료 조건 확인
    this.checkEndCondition();
  }

  // '운영진' 등장 및 관련 로직 처리
  handleManagerEvent() {
    if (Math.random() < GAME_CONSTANTS.MANAGER_APPEARANCE_PROBABILITY) {
      this.isManagerAppeared = true;
      this.broadcast('managerAppeared', {});
      
      this.players.forEach(player => {
        if (player.isDancing) {
          player.isAlive = false;
          this.broadcast('playerDied', { socketId: player.socketId, reason: 'caught dancing' });
        }
      });
    } else {
      this.isManagerAppeared = false;
    }
  }

  // 플레이어 게이지 업데이트
  updatePlayerGauges(player) {
    if (player.isDancing) {
      // 춤추는 중: 몰입 게이지 증가
      player.flowGauge = Math.min(GAME_CONSTANTS.MAX_FLOW_GAUGE, player.flowGauge + GAME_CONSTANTS.FLOW_GAUGE_INCREASE_PER_TICK);
    } else {
      // 코딩 중: 몰입 게이지 감소, commit 게이지 증가
      player.flowGauge = Math.max(0, player.flowGauge - GAME_CONSTANTS.FLOW_GAUGE_DECREASE_PER_TICK);
      
      let commitIncrease = GAME_CONSTANTS.COMMIT_GAUGE_PER_TICK;
      if (player.flowGauge < GAME_CONSTANTS.FLOW_GAUGE_PENALTY_THRESHOLD) {
        commitIncrease /= 2; // 몰입도 낮으면 commit 속도 저하
      }
      player.commitGauge += commitIncrease;

      if (player.commitGauge >= GAME_CONSTANTS.MAX_COMMIT_GAUGE) {
        player.commitGauge = 0;
        player.commitCount++;
        this.broadcast('commitSuccess', { socketId: player.socketId, commitCount: player.commitCount });
      }
    }
  }

  // 플레이어 생존 상태 확인
  checkPlayerStatus(player) {
    if (player.flowGauge <= 0) {
      player.isAlive = false;
      this.broadcast('playerDied', { socketId: player.socketId, reason: 'flow gauge depleted' });
    }
  }

  // 게임 종료 조건 확인
  checkEndCondition() {
    const alivePlayers = this.players.filter(p => p.isAlive);
    if (alivePlayers.length <= 1) {
      this.endGame(alivePlayers.length === 1 ? alivePlayers[0] : null);
    }
  }

  // 게임 종료 처리
  endGame(winner) {
    clearInterval(this.gameInterval);
    this.broadcast('gameEnded', { winner: winner ? winner.getInfo() : null });
    // TODO: RoomManager를 통해 Room 정리 로직 호출
  }

  // 플레이어 액션 처리 (socket handler에서 호출)
  handlePlayerAction(socketId, action, data) {
    const player = this.players.find(p => p.socketId === socketId);
    if (!player || !player.isAlive) return;

    switch (action) {
      case 'startDancing':
        player.isDancing = true;
        break;
      case 'stopDancing':
        player.isDancing = false;
        break;
      case 'push':
        this.handlePush(player);
        break;
      case 'useSkill':
        // player.skill.execute(...)
        break;
    }
  }

  // Push 시도 처리
  handlePush(player) {
    const successRate = player.commitCount * GAME_CONSTANTS.PUSH_SUCCESS_BASE_RATE;
    if (Math.random() < successRate) {
      // Push 성공!
      this.endGame(player);
    } else {
      // Push 실패
      player.commitCount = 0;
      this.broadcast('pushFailed', { socketId: player.socketId });
    }
  }

  // 방 전체에 이벤트 전파
  broadcast(event, data) {
    this.io.to(this.roomId).emit(event, data);
  }

  // 현재 게임 상태를 객체로 반환
  getGameState() {
    return {
      roomId: this.roomId,
      players: this.players.map(p => p.getInfo()),
      isManagerAppeared: this.isManagerAppeared,
    };
  }
}

module.exports = Game;

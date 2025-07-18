// server/games/game.js
const GAME_CONSTANTS = require('../constants/constants');
const SkillManager = require('./SkillManager');

class Game {
  constructor(roomId, players, io) {
    this.roomId = roomId;
    this.players = players; // Player 객체의 배열
    this.io = io; // Socket.io 인스턴스
    
    this.gameInterval = null; // 게임 루프의 setInterval ID
    this.isManagerAppeared = false; // 운영진 등장 여부

    this.roomManager = roomManager; // 룸 관리
  }

  start() {
    this.players.forEach(player => {
      SkillManager.assignRandomSkill(player);
    });

    this.broadcast('gameStarted', this.getGameState());

    this.gameInterval = setInterval(() => this.tick(), GAME_CONSTANTS.GAME_TICK_INTERVAL);
  }

  tick() {
    // 운영진 등장 판정 및 플레이어 탈락 여부
    this.handleManagerEvent();
    this.players.forEach(player => {
      if (!player.isAlive) return;
      this.updatePlayerGauges(player);
      this.checkPlayerStatus(player);
    });

    this.broadcast('gameStateUpdate', this.getGameState());

    // 게임 종료 조건 확인
    this.checkEndCondition();
  }

  // 운영진 등장 후 1초 동안 모션 재생 -> 플레이어 사망 처리
  handleManagerEvent() {
    if (Math.random() < GAME_CONSTANTS.MANAGER_APPEARANCE_PROBABILITY && !this.isManagerAppeared) {
      this.isManagerAppeared = true;
      setTimeout(() => {
        this.killPlayers()
      }, 1000);
    } else {
      this.isManagerAppeared = false;
    }
  }

  killPlayers() {
    this.players.forEach(player => {
      if (player.isDancing || player.isExercising || player.bumpercar) {
        player.isAlive = false;
        this.broadcast('playerDied', { socketId: player.socketId, reason: 'dancing' });
      }
    });
    this.isManagerAppeared = true;
  }

  updatePlayerGauges(player) {
    if (player.isDancing) {
      player.flowGauge = Math.min(GAME_CONSTANTS.MAX_FLOW_GAUGE, player.flowGauge + GAME_CONSTANTS.FLOW_GAUGE_INCREASE_PER_TICK);
    } else if (player.isExercising) {
      player.flowGauge = Math.max(0, player.flowGauge - GAME_CONSTANTS.FLOW_GAUGE_DECREASE_PER_TICK);
      
      let commitIncrease = GAME_CONSTANTS.COMMIT_GAUGE_PER_TICK;
      if (player.flowGauge < GAME_CONSTANTS.FLOW_GAUGE_PENALTY_THRESHOLD) {
        commitIncrease /= 2;
      }
      player.commitGauge += commitIncrease;

      if (player.commitGauge >= GAME_CONSTANTS.MAX_COMMIT_GAUGE) {
        player.commitGauge = 0;
        player.commitCount++;
        this.broadcast('commitSuccess', { socketId: player.socketId, commitCount: player.commitCount });
      }
    } else {
      
    }
  }

  checkPlayerStatus(player) {
    if (player.flowGauge <= 0) {
      player.isAlive = false;
      this.broadcast('playerDied', { socketId: player.socketId, reason: 'flow' });
    }
  }

  checkEndCondition() { // 혼자 살아남으면 승리
    const alivePlayers = this.players.filter(p => p.isAlive);
    if (alivePlayers.length <= 1) {
      this.endGame(alivePlayers.length === 1 ? alivePlayers[0] : null);
    }
  }

  endGame(winner) { // 특수 조건 승리
    clearInterval(this.gameInterval);
    this.broadcast('gameEnded', { winner: winner ? winner.getInfo() : null });

if (this.roomManager) {
    this.roomManager.rooms.delete(this.roomId);
    console.log(`[${this.roomId}] Room deleted after game ended`);
  }
  }

  handlePlayerAction(socketId, action, data) { // 키보드 액션 처리
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
        if (player.skill && player.skill.canUse()) {
        player.skill.execute(this.players);
        player.skill.onUse();
        this.broadcast('skillUsed', {
          socketId: player.socketId,
          skill: player.skill.name,
        });
      }
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

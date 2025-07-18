// server/games/Player.js
const { INITIAL_COMMIT_GAUGE, INITIAL_FLOW_GAUGE } = require('../constants/constants');

class Player {
  constructor(socketId, username) {
    // socketID, 닉네임
    this.socketId = socketId;
    this.username = username;
    // 운영진 관리
    this.isAlive = true;
    this.isDancing = false;
    // 몰입 & COMMIT 게이지
    this.commitGauge = INITIAL_COMMIT_GAUGE;
    this.flowGauge = INITIAL_FLOW_GAUGE;
    this.commitCount = 0;
    // SKILLS
    this.skill = null;
    this.bumpercar = false; // 범퍼카?
    this.isExercising = false; // 운동 중?
    this.playingGame = false; // 게임 중?
    this.hasCaffeine = false; // 커피 마심
    this.muscleGauge = 0; // 운동 게이지
    this.muscleCount = 0; // 근육량
  }
  // 플레이어의 상태를 업데이트하는 메소드들
  // 예: setDancingState, updateGauges 등은 Game.js의 게임 루프에서 호출됩니다.

  // 플레이어의 주요 정보를 객체로 반환 (클라이언트에 전송하기 위함)
  getInfo() {
    return {
      socketId: this.socketId,
      username: this.username,

      isAlive: this.isAlive,
      isDancing: this.isDancing,

      commitGauge: this.commitGauge,
      flowGauge: this.flowGauge,
      commitCount: this.commitCount,

      skill: this.skill ? this.skill.name : null, // 스킬 이름만 전송
      bumpercar: this.bumpercar,
      isExercising: this.isExercising,
      hasCaffeine: this.hasCaffeine,
      muscleCount: this.muscleCount,
    };
  }
}

module.exports = Player;

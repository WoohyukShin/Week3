// server/games/Player.js
const { INITIAL_COMMIT_GAUGE, INITIAL_FLOW_GAUGE } = require('../constants/constants');

class Player {
  constructor(socketId, username) {
    this.socketId = socketId;
    this.username = username;
    
    this.isAlive = true;      // 생존 여부
    this.isDancing = false;   // 춤추는 중인지 여부

    this.commitGauge = INITIAL_COMMIT_GAUGE; // commit 게이지
    this.flowGauge = INITIAL_FLOW_GAUGE;     // 몰입 게이지
    this.commitCount = 0;     // 성공한 commit 횟수

    this.skill = null;        // 보유 스킬
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
    };
  }
}

module.exports = Player;

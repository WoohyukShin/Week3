// server/games/skills/game.js
const Skill = require('../Skill');
const GAME_CONSTANTS = require('../../constants/constants');

class game extends Skill {
  constructor(owner) {
    super(owner);
    this.name = '게임';
    this.description = '미연시 플레이로 몰입 증가. 운영진 있어도 안전. 최대 3회.';
    this.cooldown = 10;
    this.usesLeft = 3;
  }

  execute() {
    if (this.usesLeft <= 0) return;

    this.owner.flowGauge = Math.min(
      GAME_CONSTANTS.MAX_FLOW_GAUGE,
      this.owner.flowGauge + 30
    );
    this.usesLeft--;
    this.onUse();
  }
}

module.exports = game;

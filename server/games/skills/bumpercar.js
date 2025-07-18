// server/games/skills/bumpercar.js
const Skill = require('../Skill');

class bumpercar extends Skill {
  constructor(owner) {
    super(owner);
    this.name = '노래';
    this.description = '범퍼카 재생! 다른 사람 commit 게이지 절반으로. 1회 사용.';
    this.cooldown = 9999; // 사실상 1회용
    this.used = false;
  }

  execute(allPlayers) {
    if (this.used) return;
    allPlayers.forEach(player => {
      if (player !== this.owner && player.isAlive) {
        player.commitGauge /= 2;
      }
    });
    this.used = true;
    this.onUse();
  }
}

module.exports = bumpercar;

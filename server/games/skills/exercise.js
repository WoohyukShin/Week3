// server/games/skills/exercise.js
const Skill = require('../Skill');

class exercise extends Skill {
  constructor(owner) {
    super(owner);
    this.name = '운동';
    this.description = '근육량 10 증가. 100 이상이면 승리!';
    this.cooldown = 3;
  }

  execute() {
    this.owner.muscleGauge = (this.owner.muscleGauge || 0) + 10;
    if (this.owner.muscleGauge >= 100) {
      this.owner.game.endGame(this.owner);
    }
    this.onUse();
  }
}

module.exports = exercise;
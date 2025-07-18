// server/games/skills/shotgun.js
const Skill = require('../Skill');

class shotgun extends skills {
  constructor(owner) {
    super(owner);
    this.name = '샷건';
    this.description = '운영진 강제 등장. 최대 2회 사용.';
    this.cooldown = 5;
    this.usesLeft = 2;
  }

  execute(allPlayers) {
    if (this.usesLeft <= 0) return;

    const game = this.owner.game;
    game.isManagerAppeared = true;

    game.players.forEach(player => {
      if (player.isDancing) {
        if (player.hasShield) {
          player.hasShield = false;
        } else {
          player.isAlive = false;
          game.broadcast('playerDied', {
            socketId: player.socketId,
            reason: 'caught dancing',
          });
        }
      }
    });

    game.broadcast('managerAppeared', {});
    this.usesLeft--;
    this.onUse();
  }
}

module.exports = shotgun;
// server/games/Skill.js

class Skill {
  /**
   * @param {Player} owner - 이 스킬을 소유한 플레이어
   */
  constructor(owner) {
    if (this.constructor === Skill) {
      throw new Error("Abstract class 'Skill' cannot be instantiated directly.");
    }
    this.owner = owner;
    this.name = 'Unnamed Skill';
    this.description = 'No description provided.';
    this.cooldown = 0; // 스킬 쿨다운 (초)
    this.lastUsed = 0; // 마지막 사용 시간 (Date.now())
  }

  /**
   * 스킬을 사용할 수 있는지 확인합니다.
   * @returns {boolean}
   */
  canUse() {
    return Date.now() - this.lastUsed > this.cooldown * 1000;
  }

  /**
   * 스킬을 실행합니다. 이 메소드는 자식 클래스에서 반드시 오버라이드해야 합니다.
   * @param {Player[]} allPlayers - 게임에 참여 중인 모든 플레이어 배열
   * @param {Player} [target] - 스킬의 대상이 되는 특정 플레이어 (선택적)
   */
  execute(allPlayers, target) {
    throw new Error("Method 'execute()' must be implemented.");
  }

  // 스킬 사용 후 호출
  onUse() {
    this.lastUsed = Date.now();
  }
}

module.exports = Skill;

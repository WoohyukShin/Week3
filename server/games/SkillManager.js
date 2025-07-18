// server/games/SkillManager.js
const fs = require('fs');
const path = require('path');

class SkillManager {
  constructor() {
    this.skills = new Map(); // Map<skillName, SkillClass>
    this.loadSkills();
  }

  // 'games/skills' 디렉토리에서 모든 스킬 파일을 동적으로 로드합니다.
  loadSkills() {
    const skillsDir = path.join(__dirname, 'skills');
    
    // skills 디렉토리가 없으면 생성
    if (!fs.existsSync(skillsDir)) {
        fs.mkdirSync(skillsDir);
    }

    const skillFiles = fs.readdirSync(skillsDir).filter(file => file.endsWith('.js'));

    for (const file of skillFiles) {
      try {
        const SkillClass = require(path.join(skillsDir, file));
        // 파일 이름을 기반으로 스킬 이름을 생성 (예: CaffeineSkill.js -> CaffeineSkill)
        const skillName = path.basename(file, '.js');
        this.skills.set(skillName, SkillClass);
        console.log(`Loaded skill: ${skillName}`);
      } catch (err) {
        console.error(`Failed to load skill from ${file}:`, err);
      }
    }
  }

  /**
   * 플레이어에게 랜덤 스킬을 생성하여 부여합니다.
   * @param {Player} player - 스킬을 받을 플레이어
   * @returns {Skill|null} - 생성된 스킬 인스턴스 또는 null
   */
  assignRandomSkill(player) {
    const skillNames = Array.from(this.skills.keys());
    if (skillNames.length === 0) {
      console.warn('No skills available to assign.');
      return null;
    }

    const randomSkillName = skillNames[Math.floor(Math.random() * skillNames.length)];
    const SkillClass = this.skills.get(randomSkillName);
    const skillInstance = new SkillClass(player);
    
    player.skill = skillInstance;
    console.log(`Assigned skill '${randomSkillName}' to player ${player.username}`);
    
    return skillInstance;
  }
}

// SkillManager는 싱글톤으로 사용합니다.
const instance = new SkillManager();
module.exports = instance;

// server/games/SkillManager.js
const fs = require('fs');
const path = require('path');

class SkillManager {
  constructor() {
    this.skills = new Map(); // Map<skillName, SkillClass>
    this.loadSkills();
  }

  loadSkills() {
    const skillsDir = path.join(__dirname, 'skills');
    
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
     플레이어에게 랜덤 스킬을 생성하여 부여합니다.
     @param {Player} player - 스킬을 받을 플레이어
     @returns {Skill|null}
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

const instance = new SkillManager();
module.exports = instance;

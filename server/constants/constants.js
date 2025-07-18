// server/constants/constants.js

const GAME_CONSTANTS = {
  // Room & Game Settings
  MAX_PLAYERS_PER_ROOM: 4,
  GAME_TICK_INTERVAL: 1000, // 1초마다 게임 루프 실행

  // Player Stats
  INITIAL_COMMIT_GAUGE: 0,
  MAX_COMMIT_GAUGE: 100,
  COMMIT_GAUGE_PER_TICK: 10, // 초당 commit 게이지 증가량
  
  INITIAL_FLOW_GAUGE: 100,
  MAX_FLOW_GAUGE: 100,
  FLOW_GAUGE_DECREASE_PER_TICK: 10, // 초당 몰입 게이지 감소량
  FLOW_GAUGE_INCREASE_PER_TICK: 5, // 춤 출 때 초당 몰입 게이지 증가량
  
  // 몰입 게이지가 이 값 이하일 때 commit 속도 절반
  FLOW_GAUGE_PENALTY_THRESHOLD: 50,

  // Push Mechanics
  // push 성공 확률 = PUSH_SUCCESS_BASE_RATE * commitCount
  PUSH_SUCCESS_BASE_RATE: 0.2, // commit 1회당 성공 확률 20%

  // '운영진' Event
  MANAGER_APPEARANCE_PROBABILITY: 0.1, // 매 틱마다 운영진이 등장할 확률 10%
};

module.exports = GAME_CONSTANTS;

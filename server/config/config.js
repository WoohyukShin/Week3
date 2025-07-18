// server/config/config.js

// 환경 변수 관리를 위해 dotenv 사용을 권장합니다.
// 예: require('dotenv').config();

const config = {
  // MongoDB 연결 URI
  // 로컬 DB 또는 클라우드 DB URI를 사용하세요.
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/stealing-dance-game',
  },

  // 서버 설정
  server: {
    port: process.env.PORT || 3001,
  },

  // JWT (JSON Web Token) 설정
  jwt: {
    secret: process.env.JWT_SECRET || 'your-very-secret-key',
    expiresIn: '1h', // 토큰 유효 시간
  },
};

module.exports = config;

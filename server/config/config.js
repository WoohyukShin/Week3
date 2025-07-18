// server/config/config.js

const config = {
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/stealing-dance-game',
  },

  server: {
    port: process.env.PORT || 3001,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-very-secret-key',
    expiresIn: '1h',
  },
};

module.exports = config;

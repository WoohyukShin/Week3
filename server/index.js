// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const { server: serverConfig } = require('./config/config');
const connectDB = require('./db/connect');
const userRouter = require('./routers/user');
const initializeSocketHandlers = require('./handlers/sockethandlers');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // 실제 프로덕션에서는 특정 도메인만 허용하도록 변경해야 합니다.
        methods: ["GET", "POST"]
    }
});

// 데이터베이스 연결
connectDB();

// 미들웨어 설정
app.use(cors()); // CORS 미들웨어
app.use(express.json()); // Body-parser 대신 Express 내장 기능 사용
app.use('/api/users', userRouter); // API 라우터 등록

// Socket.io 핸들러 초기화
initializeSocketHandlers(io);

// 서버 시작
const PORT = serverConfig.port;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

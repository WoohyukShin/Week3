// server/handlers/sockethandlers.js
const Player = require('../games/player');
const RoomManager = require('../games/RoomManager'); // RoomManager는 함수이므로 io를 전달해야 합니다.

// 이 객체는 플레이어의 socket.id와 그가 속한 roomId를 매핑합니다.
const playerRoomMap = new Map();

module.exports = (io) => {
  const roomManager = RoomManager(io); // io 인스턴스를 전달하여 RoomManager 싱글톤을 가져옵니다.

  const handleConnection = (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // 방 생성
    socket.on('createRoom', ({ username }) => {
      const player = new Player(socket.id, username);
      const room = roomManager.createRoom(player);
      socket.join(room.roomId);
      playerRoomMap.set(socket.id, room.roomId);
      socket.emit('roomCreated', room.getState());
    });

    // 방 참가
    socket.on('joinRoom', ({ roomId, username }) => {
      try {
        const player = new Player(socket.id, username);
        const room = roomManager.joinRoom(roomId, player);
        socket.join(roomId);
        playerRoomMap.set(socket.id, roomId);
        socket.emit('joinedRoom', room.getState());
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // 플레이어 액션
    socket.on('playerAction', (data) => {
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room && room.game) {
          room.game.handlePlayerAction(socket.id, data.action, data.payload);
        }
      }
    });

    // 연결 종료
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        roomManager.leaveRoom(roomId, socket.id);
        playerRoomMap.delete(socket.id);
      }
    });
  };

  // `connection` 이벤트에 대한 핸들러를 등록합니다.
  io.on('connection', handleConnection);
};

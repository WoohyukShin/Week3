// server/games/RoomManager.js
const Room = require('./Room');

class RoomManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // Map<roomId, Room>
  }

  createRoom(hostPlayer) {
    const roomId = this.generateRoomId();
    const room = new Room(roomId, hostPlayer);
    this.rooms.set(roomId, room);
    console.log(`Room created: ${roomId} by ${hostPlayer.username}`);
    return room;
  }

  joinRoom(roomId, player) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found.');
    }
    room.addPlayer(player);
    
    // 방에 있는 모든 사람에게 새로운 플레이어 정보 전파
    this.io.to(roomId).emit('playerJoined', room.getState());
    
    // 방이 꽉 찼으면 게임 시작
    if (room.isFull()) {
      room.startGame(this.io);
    }
    return room;
  }

  leaveRoom(roomId, socketId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.removePlayer(socketId);
      console.log(`Player ${socketId} left room ${roomId}`);
      
      if (room.isEmpty()) {
        this.rooms.delete(roomId);
        console.log(`Room destroyed: ${roomId}`);
      } else {
        // 방에 남은 사람들에게 정보 전파
        this.io.to(roomId).emit('playerLeft', room.getState());
      }
    }
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  // 간단한 랜덤 ID 생성기
  generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

// RoomManager를 싱글톤으로 만들기 위해 인스턴스를 내보냅니다.
// 실제 io 객체는 server/index.js에서 주입됩니다.
let instance = null;

module.exports = (io) => {
  if (!instance) {
    instance = new RoomManager(io);
  }
  return instance;
};

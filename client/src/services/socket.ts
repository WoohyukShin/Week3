import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001'; // 백엔드 소켓 서버 주소

class SocketService {
  public socket: Socket | null = null;

  connect(): void {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
  }

  emit(event: string, data: any): void {
    this.socket?.emit(event, data);
  }


  on(event: string, callback: (data: any) => void): void {
    this.socket?.on(event, callback);
  }
}


const socket = new SocketService();
export default socket;

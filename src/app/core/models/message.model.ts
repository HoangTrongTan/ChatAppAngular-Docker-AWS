export interface Message {
  id: string;
  content: string;
  sender: string;
  avatarIndex: number;
  roomId: string;
  timestamp: string;
  isMine?: boolean;
}

export interface SendMessagePayload {
  content: string;
  roomName: string;  // Khớp với SendMessagePayload.RoomName bên BE
}

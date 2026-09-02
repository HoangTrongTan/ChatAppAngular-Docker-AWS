export interface User {
  username: string;
  avatarIndex: number;
  joinedAt?: string;
}

export interface OnlineUser extends User {
  connectionId?: string; // SignalR connectionId (thay thế socketId)
  isOnline: boolean;
}

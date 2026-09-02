import { Injectable, signal, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message, SendMessagePayload } from '../models/message.model';
import { OnlineUser } from '../models/user.model';
import { SocketService } from './socket.service';
import { AuthService } from './auth.service';

export interface JoinRoomPayload {
  username: string;
  avatarIndex: number;
  roomId: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService implements OnDestroy {
  private readonly apiBase = `${environment.apiUrl}/messages`;
  private destroy$ = new Subject<void>();

  // ─── Reactive state (Signals) ────────────────────────────────────
  readonly messages = signal<Message[]>([]);
  readonly onlineUsers = signal<OnlineUser[]>([]);
  readonly isConnected = signal<boolean>(false);
  readonly currentRoom = signal<string>(environment.defaultRoom);

  constructor(
    private http: HttpClient,
    private socket: SocketService,
    private auth: AuthService
  ) {}

  // ─── Initialise SignalR & join room ──────────────────────────────
  init(): void {
    this.socket.connect();

    // ── Lifecycle events từ SignalR wrapper ──
    this.socket.connected$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isConnected.set(true);
      this.joinRoom();
    });

    this.socket.disconnected$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isConnected.set(false);
    });

    // ── Lắng nghe Hub events (PascalCase theo SignalR convention) ──

    /** BE gọi: Clients.Caller.SendAsync("ReceiveMessage", message) */
    this.socket.on<Message>('ReceiveMessage')
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg) => {
        const enriched: Message = { ...msg, isMine: msg.sender === this.auth.username() };
        this.messages.update((msgs) => [...msgs, enriched]);
      });

    /** BE gọi: Clients.Caller.ReceiveMessageHistory(messages) */
    this.socket.on<Message[]>('ReceiveMessageHistory')
      .pipe(takeUntil(this.destroy$))
      .subscribe((history) => {
        const username = this.auth.username();
        this.messages.set(history.map((m) => ({ ...m, isMine: m.sender === username })));
      });

    /** BE gọi: Clients.Group(roomId).SendAsync("OnlineUsers", users) */
    this.socket.on<OnlineUser[]>('OnlineUsers')
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.onlineUsers.set(users);
      });

    /** BE gọi: Clients.Group(roomId).SendAsync("UserJoined", user) */
    this.socket.on<{ username: string; avatarIndex: number }>('UserJoined')
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.onlineUsers.update((list) => {
          const exists = list.some((u) => u.username === user.username);
          return exists ? list : [...list, { ...user, isOnline: true }];
        });
      });

    /** BE gọi: Clients.Group(roomId).UserLeft(username) — truyền plain string */
    this.socket.on<string>('UserLeft')
      .pipe(takeUntil(this.destroy$))
      .subscribe((username) => {
        this.onlineUsers.update((list) => list.filter((u) => u.username !== username));
      });
  }

  // ─── Hub method invocations ──────────────────────────────────────

  joinRoom(roomId?: string): void {
    const room = roomId ?? this.currentRoom();
    if (roomId) this.currentRoom.set(roomId);

    const payload: JoinRoomPayload = {
      username: this.auth.username(),
      avatarIndex: this.auth.avatarIndex(),
      roomId: room,
    };
    // BE Hub method: Task JoinRoom(JoinRoomPayload payload)
    this.socket.emit('JoinRoom', payload);
  }

  sendMessage(content: string): void {
    const room = this.currentRoom() || environment.defaultRoom || 'general';
    const payload: SendMessagePayload = {
      content: content.trim(),
      roomName: room,
    };
    // BE Hub method: Task SendMessage(SendMessagePayload payload)
    this.socket.emit('SendMessage', payload);
  }

  leaveRoom(): void {
    // BE Hub method: Task LeaveRoom(string roomId)
    this.socket.emit('LeaveRoom', this.currentRoom());
    this.socket.disconnect();
    this.messages.set([]);
    this.onlineUsers.set([]);
  }

  // ─── HTTP REST ───────────────────────────────────────────────────
  fetchHistory(roomName: string, limit = 50, offset = 0): Observable<Message[]> {
    const params = new HttpParams()
      .set('roomName', roomName)
      .set('limit', limit)
      .set('offset', offset);
    return this.http.get<Message[]>(this.apiBase, { params });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.leaveRoom();
  }
}

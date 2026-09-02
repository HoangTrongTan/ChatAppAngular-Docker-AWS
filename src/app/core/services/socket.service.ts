import { Injectable, OnDestroy } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * SignalR wrapper service — drop-in replacement cho socket.io-client.
 * API cố ý giữ gần giống SocketService cũ (connect / disconnect / emit / on)
 * để ChatService không cần thay đổi nhiều.
 */
@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private hub!: HubConnection;

  // ─── Lifecycle events ──────────────────────────────────────────
  /** Phát khi kết nối thành công (thay thế socket event 'connect') */
  readonly connected$ = new Subject<void>();
  /** Phát khi mất kết nối (thay thế socket event 'disconnect') */
  readonly disconnected$ = new Subject<void>();

  // ─── Public API ────────────────────────────────────────────────

  connect(): void {
    if (this.hub && this.hub.state !== HubConnectionState.Disconnected) return;

    this.hub = new HubConnectionBuilder()
      .withUrl(environment.hubUrl)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(
        environment.production ? LogLevel.Warning : LogLevel.Information
      )
      .build();

    this.hub.onclose(() => {
      console.warn('[SignalR] Connection closed');
      this.disconnected$.next();
    });

    this.hub.onreconnecting((err) =>
      console.warn('[SignalR] Reconnecting…', err)
    );

    this.hub.onreconnected((connectionId) => {
      console.log('[SignalR] Reconnected:', connectionId);
      this.connected$.next();
    });

    this.hub
      .start()
      .then(() => {
        console.log('[SignalR] Connected:', this.hub.connectionId);
        this.connected$.next();
      })
      .catch((err) => console.error('[SignalR] Start error:', err));
  }

  disconnect(): void {
    this.hub?.stop().catch((err) =>
      console.error('[SignalR] Stop error:', err)
    );
  }

  /**
   * Gửi message lên Hub (tương đương socket.emit).
   * @param method  Tên Hub method, ví dụ: 'SendMessage', 'JoinRoom'
   * @param args    Các argument truyền cho Hub method
   */
  emit<T>(method: string, ...args: unknown[]): void {
    if (this.hub?.state === HubConnectionState.Connected) {
      this.hub.invoke(method, ...args).catch((err) =>
        console.error(`[SignalR] invoke '${method}' error:`, err)
      );
    } else {
      console.warn(`[SignalR] Not connected — cannot invoke '${method}'`);
    }
  }

  /**
   * Lắng nghe event từ Hub (tương đương socket.on).
   * @param event  Tên client-side handler, ví dụ: 'ReceiveMessage'
   */
  on<T>(event: string): Observable<T> {
    return new Observable<T>((observer) => {
      const handler = (data: T) => observer.next(data);
      this.hub?.on(event, handler);
      return () => this.hub?.off(event, handler);
    });
  }

  isConnected(): boolean {
    return this.hub?.state === HubConnectionState.Connected;
  }

  ngOnDestroy(): void {
    this.connected$.complete();
    this.disconnected$.complete();
    this.disconnect();
  }
}

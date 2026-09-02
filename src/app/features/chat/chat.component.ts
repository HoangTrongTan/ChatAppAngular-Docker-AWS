import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
  keyframes,
} from '@angular/animations';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { MessageBubbleComponent } from './components/message-bubble/message-bubble.component';
import { MessageInputComponent } from './components/message-input/message-input.component';
import { AVATARS } from '../../core/constants/avatars.constant';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MessageBubbleComponent, MessageInputComponent],
  animations: [
    trigger('messageEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px) scale(0.97)' }),
        animate(
          '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
    ]),
    trigger('listStagger', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(12px)' }),
            stagger(40, [animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('userJoin', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-16px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-16px)' })),
      ]),
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('400ms cubic-bezier(0.34,1.56,0.64,1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('pulse', [
      transition(':enter', [
        animate(
          '600ms ease',
          keyframes([
            style({ transform: 'scale(0)', offset: 0 }),
            style({ transform: 'scale(1.15)', offset: 0.7 }),
            style({ transform: 'scale(1)', offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  private chat = inject(ChatService);
  private auth = inject(AuthService);
  private notif = inject(NotificationService);

  readonly messages = this.chat.messages;
  readonly onlineUsers = this.chat.onlineUsers;
  readonly isConnected = this.chat.isConnected;
  readonly currentRoom = this.chat.currentRoom;
  readonly currentUsername = this.auth.username;

  private prevMessageCount = 0;
  private shouldScroll = false;

  constructor() {
    effect(() => {
      const msgs = this.messages();
      if (msgs.length > this.prevMessageCount) {
        this.shouldScroll = true;
        const newest = msgs[msgs.length - 1];
        if (newest && !newest.isMine) {
          this.notif.notifyNewMessage(newest);
        }
      }
      this.prevMessageCount = msgs.length;
    });
  }

  ngOnInit(): void {
    this.notif.requestPermission();
    this.chat.init();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  onSend(content: string): void {
    this.chat.sendMessage(content);
  }

  getAvatarUrl(index: number): string {
    return AVATARS[index]?.url ?? AVATARS[0].url;
  }

  private scrollToBottom(): void {
    const el = this.scrollContainer?.nativeElement;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }

  ngOnDestroy(): void {
    this.chat.leaveRoom();
  }
}

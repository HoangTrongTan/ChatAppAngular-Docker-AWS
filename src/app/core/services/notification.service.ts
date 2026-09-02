import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private permissionGranted = false;

  async requestPermission(): Promise<void> {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      return;
    }
    const result = await Notification.requestPermission();
    this.permissionGranted = result === 'granted';
  }

  notifyNewMessage(message: Message): void {
    if (!this.permissionGranted || document.hasFocus()) return;
    const notification = new Notification(`💬 ${message.sender}`, {
      body: message.content,
      icon: this.getAvatarUrl(message.avatarIndex),
      badge: '/favicon.ico',
      tag: 'chat-message',
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    setTimeout(() => notification.close(), 5000);
  }

  private getAvatarUrl(index: number): string {
    const avatars = [
      'https://cdn.vectorstock.com/i/1000v/10/99/blue-grizzly-mascot-logo-vector-25121099.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNzxqwZ5P3efcpMINSPEnu5FWfZIk8alFcBbFRjPPtCg&s=10',
      'https://thumbs.dreamstime.com/b/eagle-mascot-vector-logo-sign-eagle-mascot-vector-logo-sign-icon-120460928.jpg',
      'https://img.pikbest.com/png-images/20241103/high-quality-ghost-mascot-logo-designs-perfect-for-your-visual-brand-identity_11051732.png!sw800',
      'https://t4.ftcdn.net/jpg/02/42/93/97/360_F_242939706_2R8ryDx24gAmLYuYLDCLqSjFohQOzSCr.jpg',
      'https://cdn.vectorstock.com/i/1000v/60/54/sea-otter-donuts-mascot-character-logo-icon-vector-48156054.jpg',
    ];
    return avatars[index] ?? avatars[0];
  }
}

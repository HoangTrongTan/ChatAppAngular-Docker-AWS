import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';
import { AVATARS } from '../../../core/constants/avatars.constant';
import { AvatarPickerComponent } from '../../../features/chat/components/avatar-picker/avatar-picker.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AvatarPickerComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private chat = inject(ChatService);
  private router = inject(Router);

  readonly avatars = AVATARS;
  readonly showPicker = signal(false);

  readonly isLoggedIn = this.auth.isLoggedIn;
  readonly username = this.auth.username;
  readonly currentAvatarIndex = this.auth.avatarIndex;
  readonly isConnected = this.chat.isConnected;

  readonly currentAvatar = computed(() => AVATARS[this.currentAvatarIndex()] ?? AVATARS[0]);

  isOnlineAvatar(index: number): boolean {
    return this.chat.onlineUsers().some((u) => u.avatarIndex === index);
  }

  selectAvatar(index: number): void {
    if (!this.isLoggedIn()) return;
    this.auth.updateAvatar(index);
    this.chat.joinRoom();
  }

  onAvatarSelected(index: number): void {
    this.auth.updateAvatar(index);
    this.showPicker.set(false);
    this.chat.joinRoom();
  }

  logout(): void {
    this.chat.leaveRoom();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

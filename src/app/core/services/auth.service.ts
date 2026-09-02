import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

const STORAGE_KEY_USER = 'chat_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<User | null>(this.loadFromStorage());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly username = computed(() => this._currentUser()?.username ?? '');
  readonly avatarIndex = computed(() => this._currentUser()?.avatarIndex ?? 0);

  login(username: string, avatarIndex: number): void {
    const user: User = { username: username.trim(), avatarIndex, joinedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    this._currentUser.set(user);
  }

  updateAvatar(avatarIndex: number): void {
    const user = this._currentUser();
    if (!user) return;
    const updated: User = { ...user, avatarIndex };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    this._currentUser.set(updated);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_USER);
    this._currentUser.set(null);
  }

  private loadFromStorage(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}

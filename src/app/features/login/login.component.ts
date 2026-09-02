import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { animate, style, transition, trigger, keyframes } from '@angular/animations';
import { AuthService } from '../../core/services/auth.service';
import { AVATARS } from '../../core/constants/avatars.constant';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('500ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('shake', [
      transition('* => error', [
        animate(
          '400ms ease',
          keyframes([
            style({ transform: 'translateX(0)', offset: 0 }),
            style({ transform: 'translateX(-8px)', offset: 0.2 }),
            style({ transform: 'translateX(8px)', offset: 0.4 }),
            style({ transform: 'translateX(-6px)', offset: 0.6 }),
            style({ transform: 'translateX(6px)', offset: 0.8 }),
            style({ transform: 'translateX(0)', offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly avatars = AVATARS;
  readonly selectedAvatar = signal(0);
  readonly showError = signal(false);
  readonly shakeState = signal<string>('idle');

  username = '';

  selectAvatar(index: number): void {
    this.selectedAvatar.set(index);
  }

  submit(): void {
    if (this.username.trim().length < 2) {
      this.showError.set(true);
      this.shakeState.set('error');
      setTimeout(() => this.shakeState.set('idle'), 500);
      return;
    }
    this.showError.set(false);
    this.auth.login(this.username.trim(), this.selectedAvatar());
    this.router.navigate(['/chat']);
  }
}

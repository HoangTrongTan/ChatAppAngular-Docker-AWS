import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { AVATARS } from '../../../../core/constants/avatars.constant';

@Component({
  selector: 'app-avatar-picker',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('backdropAnim', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms ease', style({ opacity: 0 }))]),
    ]),
    trigger('dialogAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9) translateY(-20px)' }),
        animate('250ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ]),
  ],
  templateUrl: './avatar-picker.component.html',
})
export class AvatarPickerComponent {
  @Input() currentIndex = 0;
  @Output() selected = new EventEmitter<number>();
  @Output() closed = new EventEmitter<void>();

  readonly avatars = AVATARS;

  onSelect(index: number): void {
    this.selected.emit(index);
  }
}

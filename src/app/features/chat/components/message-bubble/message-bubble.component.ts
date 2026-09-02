import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../core/models/message.model';
import { AVATARS } from '../../../../core/constants/avatars.constant';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-bubble.component.html',
})
export class MessageBubbleComponent {
  @Input({ required: true }) message!: Message;

  get avatarUrl(): string {
    return AVATARS[this.message.avatarIndex]?.url ?? AVATARS[0].url;
  }
}

import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-input.component.html',
})
export class MessageInputComponent {
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;

  messageText = '';
  canSend = signal(false);

  onInput(): void {
    this.canSend.set(this.messageText.trim().length > 0);
    this.autoResize();
  }

  onEnter(event: Event): void {
    const kbEvent = event as KeyboardEvent;
    if (!kbEvent.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  submit(): void {
    const text = this.messageText.trim();
    if (!text) return;
    this.sendMessage.emit(text);
    this.messageText = '';
    this.canSend.set(false);
    setTimeout(() => this.resetResize(), 0);
  }

  private autoResize(): void {
    const el = this.textareaRef?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }

  private resetResize(): void {
    const el = this.textareaRef?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
  }
}

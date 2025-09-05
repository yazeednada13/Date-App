import {
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import { MessageService } from '../../../core/_services/message-service';
import { MemberService } from '../../../core/_services/member-service';
import { Message } from '../../../types/message';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css',
})
export class MemberMessages implements OnInit {
  @ViewChild('messageEndRef') messageEndRef!: ElementRef;
  private messageService = inject(MessageService);
  // To get information about the member whose page we opened,
  //  not the one who is logged in.
  private memberService = inject(MemberService);
  protected messages = signal<Message[]>([]);
  protected messageContent = '';
  constructor() {
    effect(() => {
      const currentMessages = this.messages();
      if (currentMessages.length > 0) {
        this.scrollToBottom();
      }
    });
  }
  ngOnInit(): void {
    this.loadMessages();
  }
  loadMessages() {
    const memberId = this.memberService.member()?.id;
    if (memberId) {
      this.messageService.getMessageThread(memberId).subscribe({
        next: (messages) =>
          this.messages.set(
            messages.map((message) => ({
              ...message,
              currentUserSender: message.senderId !== memberId,
            }))
          ),
      });
    }
  }
  sendMessage() {
    const recipientId = this.memberService.member()?.id;
    if (!recipientId) return;
    this.messageService
      .sendMessage(recipientId, this.messageContent)
      .subscribe({
        next: (message) => {
          this.messages.update((messages) => {
            message.currentUserSender = true;
            return [...messages, message];
          });
          this.messageContent = '';
        },
      });
  }
  scrollToBottom() {
    setTimeout(() => {
      if (this.messageEndRef) {
        this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

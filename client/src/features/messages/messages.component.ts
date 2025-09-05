import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../core/_services/message-service';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';
import { Paginator } from '../../app/shared/paginator/paginator';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [Paginator, RouterLink, DatePipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  private messageService = inject(MessageService);
  protected container = 'Inbox';
  protected fetchedContainer = 'Inbox';
  protected pageNumber = 1;
  protected pageSize = 10;
  protected paginatedMessages = signal<PaginatedResult<Message> | null>(null);
  tabs = [
    { label: 'Inbox', value: 'Inbox' },
    { label: 'Oubox', value: 'Outbox' },
  ];

  ngOnInit(): void {
    this.loadMessages();
  }
  loadMessages() {
    this.messageService
      .getMessages(this.container, this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          this.paginatedMessages.set(response);
          this.fetchedContainer = this.container;
        },
      });
  }
  deleteMessage(event: Event, id: string) {
    event.stopPropagation();
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        const current = this.paginatedMessages();
        if (current?.items) {
          this.paginatedMessages.update((prev) => {
            if (!prev) return null;

            const newItems = prev.items.filter((x) => x.id !== id);

            // لازم دايمًا نرجع metadata (مش undefined)
            const meta = prev.metadata;

            return {
              items: newItems,
              metadata: {
                ...meta,
                totalCount: meta.totalCount - 1,
                totalPages: Math.max(
                  1,
                  Math.ceil((meta.totalCount - 1) / meta.pageSize)
                ),
                currentPage: Math.min(
                  meta.currentPage,
                  Math.max(1, Math.ceil((meta.totalCount - 1) / meta.pageSize))
                ),
              },
            };
          });
        }
      },
    });
  }

  get isInbox() {
    return this.fetchedContainer === 'Inbox';
  }
  setContainer(container: string) {
    this.container = container;
    this.pageNumber = 1;
    this.loadMessages();
  }
  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.loadMessages();
  }
}

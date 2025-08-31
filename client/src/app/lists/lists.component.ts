import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/_services/likes-service';
import { Member } from '../../types/member';
import { MemberCard } from '../../features/members/member-card/member-card';
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from '../shared/paginator/paginator';

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent implements OnInit {
  private likesService = inject(LikesService);
  protected paginatedResult = signal<PaginatedResult<Member> | null>(null);
  protected predicate = 'liked';
  protected pageNumber = 1;
  protected pageSize = 5;

  protected members = signal<Member[]>([]);

  tabs = [
    {
      label: 'Liked',
      value: 'liked',
    },
    {
      label: 'Liked me',
      value: 'likedBy',
    },
    {
      label: 'Mutual',
      value: 'mutual',
    },
  ];

  ngOnInit(): void {
    this.loadLikes();
  }
  setPredicate(predicate: string) {
    if (this.predicate !== predicate) {
      this.predicate = predicate;
      this.pageNumber = 1;
      this.loadLikes();
    }
  }
  loadLikes() {
    this.likesService
      .getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => this.paginatedResult.set(response),
      });
  }
  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.loadLikes();
  }
}

import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/_services/member-service';
import { Observable } from 'rxjs';

import { Member, MemberParams } from '../../../types/member';
import { MemberCard } from '../member-card/member-card';
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from '../../../app/shared/paginator/paginator';
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  private memberService = inject(MemberService);
  // witout subscription
  // async pipe is used to handle the observable
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  private updatedParams = new MemberParams();

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams = JSON.parse(filters);
      this.updatedParams = JSON.parse(filters);
    }
  }
  ngOnInit(): void {
    this.loadMembers();
  }
  loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: (result) => {
        this.paginatedMembers.set(result);
      },
    });
  }
  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;

    this.loadMembers();
  }
  openModal() {
    this.modal.open();
  }
  onClose() {
    console.log('Modal closed');
  }
  onfilterChange(data: MemberParams) {
    this.memberParams = { ...data };
    this.updatedParams = { ...data };
    this.loadMembers();
  }
  resetFilters() {
    this.memberParams = new MemberParams();
    this.updatedParams = new MemberParams();
    this.loadMembers();
  }
  get dispalyMessage(): string {
    const defaultParams = new MemberParams();
    const filters: string[] = [];

    if (this.updatedParams.gender) {
      filters.push(this.updatedParams.gender + 's');
    } else {
      filters.push('Males, Females');
    }

    if (
      this.updatedParams.minAge !== defaultParams.minAge ||
      this.updatedParams.maxAge !== defaultParams.maxAge
    ) {
      filters.push(
        ` ages ${this.updatedParams.minAge}-${this.memberParams.maxAge}`
      );
    }
    filters.push(
      this.updatedParams.orderBy === 'lastActive'
        ? 'Recently active'
        : 'Newest members'
    );

    return filters.length > 0
      ? `Selected: ${filters.join(' | ')}`
      : 'all members';
  }
}

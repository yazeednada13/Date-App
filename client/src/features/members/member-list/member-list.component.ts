import { Component, inject } from '@angular/core';
import { MemberService } from '../../../core/_services/member-service';
import { Observable } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { Member } from '../../../types/member';
import { MemberCard } from '../member-card/member-card';

@Component({
  selector: 'app-member-list',
  imports: [AsyncPipe, MemberCard],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent {
  private memberService = inject(MemberService);
  // witout subscription
  // async pipe is used to handle the observable
  protected members$: Observable<Member[]>;

  constructor() {
    this.members$ = this.memberService.getMembers();
  }
}

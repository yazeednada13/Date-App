import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

import { AccountService } from './account.service';
import { EditableMember, Member, Photo } from '../../types/member';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  editMode = signal(false);
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  member = signal<Member | null>(null);
  baseUrl = environment.apiUrl;
  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }
  getMember(id: string) {
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap((member) => {
        this.member.set(member);
      })
    );
  }
  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }
  upadteMember(member: EditableMember) {
    return this.http.put(this.baseUrl + 'members', member);
  }
}

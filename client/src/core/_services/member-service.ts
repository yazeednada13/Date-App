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
  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formData);
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(
      this.baseUrl + 'members/set-main-photo/' + photo.id,
      {}
    );
  }
  deletePhoto(photoId: Number) {
    return this.http.delete(this.baseUrl + 'members/delete-photo/' + photoId);
  }
}

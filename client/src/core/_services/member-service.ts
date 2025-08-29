import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

import { AccountService } from './account.service';
import {
  EditableMember,
  Member,
  MemberParams,
  Photo,
} from '../../types/member';
import { tap } from 'rxjs';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  editMode = signal(false);

  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  member = signal<Member | null>(null);
  baseUrl = environment.apiUrl;
  getMembers(memberParams: MemberParams) {
    let params = new HttpParams();

    params = params.append('pageNumber', memberParams.pageNumber);
    params = params.append('pageSize', memberParams.pageSize);
    params = params.append('minAge', memberParams.minAge);
    params = params.append('maxAge', memberParams.maxAge);
    params = params.append('orderBy', memberParams.orderBy);

    if (memberParams.gender)
      params = params.append('gender', memberParams.gender);

    return this.http
      .get<PaginatedResult<Member>>(this.baseUrl + 'members', {
        params: params,
      })
      .pipe(
        tap(() => {
          localStorage.setItem('filters', JSON.stringify(memberParams));
        })
      );
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

import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/_services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../types/member';
import { ImageUpload } from '../../../app/shared/image-upload/image-upload';
import { AccountService } from '../../../core/_services/account.service';
import { User } from '../../../types/user';
import { StarButton } from '../../../app/shared/star-button/star-button';
import { DeleteButton } from '../../../app/shared/delete-button/delete-button';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  constructor() {}
  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.params['id'];
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: (photos) => this.photos.set(photos),
      });
    }
  }

  onUploadedPhoto(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo) => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update((photos) => [...photos, photo]);
        if (!this.memberService.member()?.imageUrl) {
          this.setMainLocalPhoto(photo);
        }
      },
      error: (error) => {
        console.log(error);
        this.loading.set(false);
      },
    });
  }
  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setMainLocalPhoto(photo);
      },
    });
  }
  deletePhoto(photoId: Number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update((photos) => photos.filter((x) => x.id !== photoId));
      },
    });
  }
  private setMainLocalPhoto(photo: Photo) {
    const currentUser = this.accountService.currentUser();
    if (currentUser) currentUser.imageUrl = photo.url;
    this.accountService.setCurrentUser(currentUser as User);
    this.memberService.member.update(
      (member) =>
        ({
          ...member,
          imageUrl: photo.url,
        } as Member)
    );
  }
}

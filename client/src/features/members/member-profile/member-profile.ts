import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/_services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/_services/toast-service';
import { AccountService } from '../../../core/_services/account.service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify(
    $event: BeforeUnloadEvent
  ) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  protected memberService = inject(MemberService);
  private accountService = inject(AccountService);
  private toast = inject(ToastService);

  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: '',
  };
  constructor() {}
  ngOnInit(): void {
    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
    };
  }

  updateProfile() {
    if (!this.memberService.member()) return;

    const updatedMember = {
      ...this.memberService.member(),
      ...this.editableMember,
    };
    this.memberService.upadteMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (
          currentUser &&
          currentUser?.displayName !== updatedMember.displayName
        ) {
          currentUser.displayName = updatedMember.displayName;
          this.accountService.setCurrentUser(currentUser);
        }

        this.toast.success('Profile updated successfully');
        this.memberService.editMode.set(false);
        this.memberService.member.set(updatedMember as Member);
        this.editForm?.reset(updatedMember);
      },
    });
  }
  // Cancel edit mode
  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }
}

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/_services/member-service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/_services/account.service';
import { PresenceService } from '../../../core/_services/presence-service';

@Component({
  selector: 'app-member-detail',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
})
export class MemberDetailComponent implements OnInit {
  protected memberService = inject(MemberService);
  private accountSevice = inject(AccountService);
  protected presenceService = inject(PresenceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // if route change, title will change
  protected title = signal<string | undefined>('Profile');
  // Computed : return true or false
  // if current user is the same as the member in the route
  protected isCurrentUser = computed(() => {
    return (
      this.accountSevice.currentUser()?.id ===
      this.route.snapshot.paramMap.get('id')
    );
  });

  ngOnInit(): void {
    // first child is the child route of member detail
    this.title.set(this.route.firstChild?.snapshot?.title);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.title.set(this.route.firstChild?.snapshot?.title);
        },
      });
  }
}

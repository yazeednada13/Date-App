import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { MemberService } from '../../core/_services/member-service';
import { Member } from '../../types/member';
import { EMPTY } from 'rxjs';

export const memberResolver: ResolveFn<Member> = (route, state) => {
  // resolver is used to fetch data before the route is activated(opened component)
  const memberService = inject(MemberService);
  const memberId = route.paramMap.get('id');
  const router = inject(Router);

  if (!memberId) {
    router.navigateByUrl('/not-found');
    return EMPTY;
  }
  return memberService.getMember(memberId);
};

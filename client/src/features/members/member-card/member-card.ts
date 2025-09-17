import { Component, computed, inject, input, Input } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikesService } from '../../../core/_services/likes-service';
import { PresenceService } from '../../../core/_services/presence-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css',
})
export class MemberCard {
  private likeService = inject(LikesService);
  private presenceService = inject(PresenceService);

  member = input.required<Member>();
  protected isOnline = computed(() =>
    this.presenceService.onlineUsers().includes(this.member().id)
  );

  protected hasLiked = computed(() =>
    this.likeService.likeIds().includes(this.member().id)
  );
  toggleLike(event: Event) {
    event.stopPropagation();
    this.likeService.toggleLike(this.member().id);
  }
}

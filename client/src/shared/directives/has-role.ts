import {
  Directive,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AccountService } from '../../core/_services/account.service';

@Directive({
  selector: '[appHasRole]',
})
export class HasRole implements OnInit {
  @Input() appHasRole: string[] = [];
  private accountService = inject(AccountService);
  private viewContainerRef = inject(ViewContainerRef);
  private templatRef = inject(TemplateRef);

  ngOnInit(): void {
    if (
      this.accountService
        .currentUser()
        ?.roles?.some((r) => this.appHasRole.includes(r))
    ) {
      this.viewContainerRef.createEmbeddedView(this.templatRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}

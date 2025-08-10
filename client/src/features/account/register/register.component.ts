import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/_services/account.service';

import { RegisterCreds, User } from '../../../types/user';
import { ToastService } from '../../../core/_services/toast-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private accountService = inject(AccountService);
  // Input from HomeComponent
  public membersFromHome = input.required<User[]>();
  private toastr = inject(ToastService);
  protected creds = {} as RegisterCreds;
  // Child to parent communication
  // Register to HomeComponent
  cancelRegister = output<boolean>();
  register() {
    this.accountService.register(this.creds).subscribe({
      next: (response) => {
        console.log(response);
        this.cancel();
      },
      error: (error) => this.toastr.error(error.error),
    });
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}

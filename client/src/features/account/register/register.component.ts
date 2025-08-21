import { Component, Inject, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../../core/_services/account.service';

import { RegisterCreds, User } from '../../../types/user';
import { ToastService } from '../../../core/_services/toast-service';
import { JsonPipe } from '@angular/common';
import { TextInput } from '../../../app/shared/text-input/text-input';
import { Router } from '@angular/router';
import { MemberService } from '../../../core/_services/member-service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  protected accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  private router = inject(Router);
  private toastr = inject(ToastService);
  protected creds = {} as RegisterCreds;
  protected validationsErrors = signal<string[]>([]);
  protected credentialForm: FormGroup = new FormGroup({});
  protected profileForm: FormGroup = new FormGroup({});
  protected currentStep = signal(1);

  constructor() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });

    this.profileForm = this.fb.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });

    this.credentialForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialForm.controls['confirmPaswword'].updateValueAndValidity();
    });
  }

  // Input from HomeComponent

  matchValues(matchTo: string): ValidatorFn {
    // control : confirm password
    return (control: AbstractControl): ValidationErrors | null => {
      // Form Group
      const parent = control.parent;
      if (!parent) return null;
      // Password
      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    };
  }

  nextStep() {
    if (this.credentialForm.valid) {
      this, this.currentStep.update((prevStep) => prevStep + 1);
    }
  }
  prevStep() {
    this.currentStep.update((prevStep) => prevStep - 1);
  }
  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }
  // Child to parent communication
  // Register to HomeComponent
  cancelRegister = output<boolean>();
  register() {
    if (this.credentialForm.valid && this.credentialForm.valid) {
      const formData = {
        ...this.credentialForm.value,
        ...this.profileForm.value,
      };
      this.accountService.register(formData).subscribe({
        next: () => {
          this.router.navigateByUrl('/members');
        },
        error: (error) => {
          console.log(error);
          this.validationsErrors.set(error);
        },
      });
    }
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}

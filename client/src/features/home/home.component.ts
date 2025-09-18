import { Component, inject, Input, input, OnInit, signal } from '@angular/core';
import { RegisterComponent } from '../account/register/register.component';
import { HttpClient } from '@angular/common/http';
import { User } from '../../types/user';
import { AccountService } from '../../core/_services/account.service';

@Component({
  selector: 'app-home',
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @Input({ required: true }) membersFromApp: User[] = [];
  protected registerMode = signal(false);
  protected accountService = inject(AccountService);
  http = inject(HttpClient);
  users: any;
  showRegister(value: boolean) {
    this.registerMode.set(value);
  }

  ngOnInit(): void {}
}

import { Component, inject, Input, input, OnInit, signal } from '@angular/core';
import { RegisterComponent } from '../account/register/register.component';
import { HttpClient } from '@angular/common/http';
import { User } from '../../types/user';

@Component({
  selector: 'app-home',
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @Input({ required: true }) membersFromApp: User[] = [];
  protected registerMode = signal(false);
  http = inject(HttpClient);
  users: any;
  showRegister(value: boolean) {
    this.registerMode.set(value);
  }
  registerToggle() {
    //this.registerMode = !this.registerMode;
  }
  ngOnInit(): void {
    this.getUsers();
  }
  cancelRegisterMode(event: boolean) {
    //this.registerMode = event;
  }
  getUsers() {
    this.http.get('https://localhost:5001/api/user').subscribe({
      next: (response) => (this.users = response), // Arrow Function (Response from API)
      error: (error) => console.log(error),
      complete: () => console.log('Request has completed'),
    });
  }
}

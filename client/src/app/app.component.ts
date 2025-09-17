import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from '../layout/nav/nav.component';

import { HomeComponent } from '../features/home/home.component';
import { lastValueFrom } from 'rxjs';
import { User } from '../types/user';
import { NgClass } from '@angular/common';
import { ConfirmDialog } from './shared/confirm-dialog/confirm-dialog';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, HomeComponent, NgClass, ConfirmDialog],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected router = inject(Router);

  private http = inject(HttpClient);
  protected title = 'Dating App';
  protected members = signal<User[]>([]);
  baseUrl = environment.apiUrl;
  async getMembers() {
    try {
      return lastValueFrom(this.http.get<User[]>(this.baseUrl + 'api/user'));
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  }
}

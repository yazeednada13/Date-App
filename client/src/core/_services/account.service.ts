import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}
  baseUrl = environment.apiUrl;
  private likesService = inject(LikesService);
  currentUser = signal<User | null>(null);

  login(creds: LoginCreds) {
    return this.http
      .post<User>(this.baseUrl + 'account/login', creds, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          if (user) {
            this.setCurrentUser(user);
            this.startTokenRefreshInterval();
          }
        })
      );
  }
  register(creds: RegisterCreds) {
    return this.http
      .post<User>(this.baseUrl + 'account/register', creds, {
        withCredentials: true,
      })
      .pipe(
        map((user) => {
          if (user) {
            this.setCurrentUser(user);
            this.startTokenRefreshInterval();
          }
        })
      );
  }

  refreshToken() {
    return this.http.post<User>(
      this.baseUrl + 'account/refresh-token',
      {},
      { withCredentials: true }
    );
  }

  startTokenRefreshInterval() {
    setInterval(() => {
      this.http
        .post<User>(
          this.baseUrl + 'account/refresh-token',
          {},
          { withCredentials: true }
        )
        .subscribe({
          next: (user) => {
            this.setCurrentUser(user);
          },
          error: () => {
            this.logout();
          },
        });
    }, 5 * 60 * 1000);
  }

  setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user);
    this.currentUser.set(user);
    this.likesService.getLikesIds();
  }
  logout() {
    localStorage.removeItem('filters');
    this.likesService.clearLikeId();
    this.currentUser.set(null);
  }
  private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role)
      ? jsonPayload.role
      : [jsonPayload.role];
  }
}

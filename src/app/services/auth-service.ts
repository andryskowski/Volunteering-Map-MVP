import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  _id: number;
  login: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }
    this.token = localStorage.getItem('jwtToken');
  }

  login(login: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { login, password })
      .pipe(tap((res) => this.setCurrentUser(res.user, res.token)));
  }

  register(
    login: string,
    password: string,
    email: string,
    avatarUrl: string,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, { login, password, email, avatarUrl })
      .pipe(tap((res) => this.setCurrentUser(res.user, res.token)));
  }

  logout() {
    this.token = null;
    this.currentUserSubject.next(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
  }

  getToken(): string | null {
    return this.token;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateCurrentUser(updated: Partial<User>) {
    const current = this.currentUserSubject.value;
    if (!current) return;
    const newUser = { ...current, ...updated };
    this.currentUserSubject.next(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
  }

  private setCurrentUser(user: User, token: string) {
    this.token = token;
    this.currentUserSubject.next(user);
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }
}

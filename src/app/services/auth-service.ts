import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  _id: number;
  login: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

interface MockUser extends User {
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private token: string | null = null;

  private usersUrl = 'assets/mock-data/users.json';

  constructor(private http: HttpClient) {
    const userJson = localStorage.getItem('currentUser');

    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }

    this.token = localStorage.getItem('jwtToken');
  }

  login(login: string, password: string): Observable<AuthResponse> {
    return this.http.get<MockUser[]>(this.usersUrl).pipe(
      map(users => {
        const user = users.find(
          u => u.login === login && u.password === password
        );

        if (!user) {
          throw new Error('Invalid login or password');
        }

        const { password: _, ...userWithoutPassword } = user;

        return {
          token: `mock-jwt-token-${user._id}`,
          user: userWithoutPassword
        };
      }),
      tap(res => this.setCurrentUser(res.user, res.token)),
      delay(300)
    );
  }

  register(
    login: string,
    password: string,
    email: string,
    avatarUrl: string
  ): Observable<AuthResponse> {

    return this.http.get<MockUser[]>(this.usersUrl).pipe(
      map(users => {

        const existingUser = users.find(
          user => user.login === login || user.email === email
        );

        if (existingUser) {
          throw new Error('User already exists');
        }

        const newUser: User = {
          _id: Date.now(),
          login,
          email,
          avatarUrl,
          role: 'user',
          createdAt: new Date().toISOString()
        };

        return {
          token: `mock-jwt-token-${newUser._id}`,
          user: newUser
        };
      }),
      tap(res => this.setCurrentUser(res.user, res.token)),
      delay(300)
    );
  }

  logout(): void {
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

  updateCurrentUser(updated: Partial<User>): void {
    const current = this.currentUserSubject.value;

    if (!current) {
      return;
    }

    const newUser = {
      ...current,
      ...updated
    };

    this.currentUserSubject.next(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
  }

  private setCurrentUser(user: User, token: string): void {
    this.token = token;
    this.currentUserSubject.next(user);

    localStorage.setItem('jwtToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }
}
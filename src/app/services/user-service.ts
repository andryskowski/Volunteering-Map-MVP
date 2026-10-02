import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  _id: number;
  login: string;
  email: string;
  role: UserRole;
  password?: string;
  createdAt: string;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly mockUrl = 'assets/mock-data/users.json';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.mockUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.getUsers().pipe(
      map((users) => {
        const user = users.find(
          (user) => Number(user._id) === Number(id)
        );

        if (!user) {
          throw new Error(`User with id ${id} not found`);
        }

        return user;
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    // Mock only - the JSON file cannot be modified from the browser.
    return of(void 0);
  }

  updateUser(
    id: number,
    updatedData: Partial<User>
  ): Observable<User> {
    return this.getUsers().pipe(
      map((users) => {
        const user = users.find(
          (user) => Number(user._id) === Number(id)
        );

        if (!user) {
          throw new Error(`User with id ${id} not found`);
        }

        return {
          ...user,
          ...updatedData,
        };
      })
    );
  }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credentials, AuthenticatedUser, User, UserToSignUp } from '@core/state/auth';
import { Observable, timer, throwError } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly baseUrl = 'http://localhost:3000/users';
  private readonly http = inject(HttpClient);

  public signIn({ email, password }: Credentials): Observable<AuthenticatedUser> {
    return this.http
      .get<User[]>(this.baseUrl, {
        params: {
          email,
          password,
        },
      })
      .pipe(
        delay(2000),
        map((users) => {
          console.log(users);
          if (users && users.length > 0) {
            const user = users[0];
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }

          throw new Error('Bad credentials');
        }),
      );
  }

  public signUp(user: UserToSignUp): Observable<AuthenticatedUser> {
    // return timer(1000).pipe(
    //   switchMap(() => throwError(() => new Error('Symulowany błąd rejestracji'))),
    // );
    return this.http.post<User>(this.baseUrl, user).pipe(
      delay(2000),
      map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
    );
  }
}

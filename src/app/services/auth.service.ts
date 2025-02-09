import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keycloakUrl = 'http://localhost:8080/realms/hospital-realm/protocol/openid-connect/token';
  private keycloakLogoutUrl = 'http://localhost:8080/realms/hospital-realm/protocol/openid-connect/logout';
  private clientId = 'admin-cli';
  private clientSecret = 'lZ7ngbTdzKR5C43H0JHQsyjKDynVzdZu';

  constructor(private http: HttpClient, private router: Router) {}


  login(email: string, password: string): Observable<void> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret)
      .set('username', email)
      .set('password', password);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post(this.keycloakUrl, body.toString(), { headers }).pipe(
      map((response: any) => {
        this.storeTokens(response);
        this.router.navigateByUrl('/dashboard');
      }),
      catchError(error => {
        console.error('Errore login:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const body = new HttpParams()
        .set('client_id', this.clientId)
        .set('client_secret', this.clientSecret)
        .set('refresh_token', refreshToken);

      this.http.post(this.keycloakLogoutUrl, body.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      }).subscribe({
        next: () => console.log('Token revocato su Keycloak'),
        error: (err) => console.error('Errore nella revoca del token:', err)
      });
    }

    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  getToken(): Observable<string> {
    const tokenExpiry = parseInt(localStorage.getItem('tokenExpiry') || '0', 10);
    if (tokenExpiry <= Date.now()) {
      return this.refreshToken().pipe(
        switchMap(() => of(localStorage.getItem('accessToken') || ''))
      );
    }
    return of(localStorage.getItem('accessToken') || '');
  }


  private refreshToken(): Observable<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.warn('Nessun refresh token trovato. L’utente deve accedere nuovamente.');
      return throwError(() => new Error('No refresh token available'));
    }

    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret)
      .set('refresh_token', refreshToken);

    return this.http.post(this.keycloakUrl, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).pipe(
      map((response: any) => {
        this.storeTokens(response);
      }),
      catchError(error => {
        console.error('Errore nel refresh token:', error);
        return throwError(() => error);
      })
    );
  }


  private storeTokens(response: any) {
    localStorage.setItem('accessToken', response.access_token);
    localStorage.setItem('refreshToken', response.refresh_token || '');
    localStorage.setItem('tokenExpiry', (Date.now() + response.expires_in * 1000).toString());
    localStorage.setItem('refreshTokenExpiry', (Date.now() + response.refresh_expires_in * 1000).toString());
  }

  register(username: string, email: string, password: string): Observable<any> {
    const body = {
      username: username,
      email: email,
      password: password
    };

    return this.http.post(`${this.keycloakUrl}/register`, body).pipe(
      map(response => {
        console.log('Registrazione avvenuta con successo:', response);
        return response;
      }),
      catchError(error => {
        console.error('Errore durante la registrazione:', error);
        return throwError(() => error);
      })
    );
  }

  getCurrentUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user ? user.id : null;
  }


}

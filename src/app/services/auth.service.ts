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
  keycloak: any;

  constructor(private http: HttpClient, private router: Router) {}

  async initKeycloak(): Promise<void> {
    await this.keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'hospital-realm',
        clientId: 'hospital-app'
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
      }
    });
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }

  isAuthenticated(): Promise<boolean> {
    return this.keycloak.isLoggedIn();
  }

  getToken(): Promise<string> {
    return this.keycloak.getToken();
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

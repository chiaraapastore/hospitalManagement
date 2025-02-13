import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import {Utente} from '../models/utente';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private apiUrl = 'http://localhost:8081/api/utente/user-info';
  constructor(private keycloakService: KeycloakService, private router: Router, private http: HttpClient) {}

  async login(): Promise<void> {
    try {
      await this.keycloakService.login();
      await this.redirectUserByRole();
    } catch (error) {
      console.error('Errore durante il login:', error);
    }
  }

  async redirectUserByRole(): Promise<void> {
    const isAuthenticated = await this.keycloakService.isLoggedIn();
    if (isAuthenticated) {
      const roles = this.keycloakService.getUserRoles();

      if (roles.includes('admin')) {
        this.router.navigate(['/admin']);
      } else if (roles.includes('dottore')) {
        this.router.navigate(['/dottore']);
      } else if (roles.includes('capo-reparto')) {
        this.router.navigate(['/capo-reparto']);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  getUserInfo(): Observable<Utente> {
    return this.http.get<Utente>(this.apiUrl).pipe(
      catchError((err: any) => {
        console.error('Errore nel recupero delle informazioni utente:', err);
        return throwError(() => new Error('Errore durante il recupero dell\'utente')); // ✅ throwError ora riconosciuto
      })
    );
  }


  logout(): void {
    const redirectUri = window.location.origin;
    this.keycloakService.logout(redirectUri).catch(error => {
      console.error("Errore durante il logout:", error);
    });
  }
}

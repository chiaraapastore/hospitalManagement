import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  constructor(private keycloakService: KeycloakService, private router: Router) {}

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



  logout(): void {
    const redirectUri = window.location.origin;
    this.keycloakService.logout(redirectUri).catch(error => {
      console.error("Errore durante il logout:", error);
    });
  }
}

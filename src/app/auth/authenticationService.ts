import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private keycloakService: KeycloakService) {}

  async getLoggedInUser(): Promise<{ username?: string } | null> {
    try {
      const isAuthenticated = await this.keycloakService.isLoggedIn();
      if (isAuthenticated) {
        const keycloakInstance = this.keycloakService.getKeycloakInstance();
        if (keycloakInstance && keycloakInstance.tokenParsed) {
          const tokenParsed: any = keycloakInstance.tokenParsed;
          const username = tokenParsed.preferred_username;
          return { username };
        }
      }
      return null;
    } catch (error) {
      console.error("Errore durante il recupero dell'utente loggato:", error);
      return null;
    }
  }



  logout(): void {
    const redirectUri = window.location.origin;
    this.keycloakService.logout(redirectUri).catch(error => {
      console.error("Errore durante il logout:", error);
    });
  }
}

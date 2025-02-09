import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    try {
      const isAuthenticated = await this.keycloakService.isLoggedIn();
      console.log('Utente autenticato:', isAuthenticated);

      if (!isAuthenticated) {
        console.log('Utente non autenticato. Reindirizzo al login.');
        await this.keycloakService.login({ redirectUri: window.location.origin + state.url });
        return false;
      }

      const userRoles = this.keycloakService.getUserRoles();
      console.log('Ruoli dell\'utente:', userRoles);

      const requiredRoles: string[] = route.data['roles'] || [];
      console.log('Ruoli richiesti per accedere:', requiredRoles);

      if (requiredRoles.some((role) => userRoles.includes(role))) {
        console.log('Accesso consentito alla rotta:', state.url);
        return true;
      }

      console.log('Accesso negato. Reindirizzo a /not-authorized.');
      this.router.navigate(['/not-authorized']);
      return false;
    } catch (error) {
      console.error('Errore durante la verifica dei permessi:', error);
      this.router.navigate(['/error']);
      return false;
    }
  }
}

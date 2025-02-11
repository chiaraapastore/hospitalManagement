import {Component, OnInit, Renderer2} from '@angular/core';
import {NavigationEnd, Router, Event} from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AuthenticationService } from './auth/authenticationService';
import {UtenteService} from './services/utente.service';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hospitalCare';
  userDetails: any;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthenticationService,
    private keycloakService: KeycloakService,
    private utenteService: UtenteService
  ) {

    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
      });
  }

  ngOnInit(): void {
    if (this.keycloakService.isLoggedIn()) {
      this.getUserDetails();
      this.logUserRoles();
      this.redirectAdmin();
    }
  }

  async goToUserProfile(): Promise<void> {
    try {
      const isAuthenticated = await this.keycloakService.isLoggedIn();
      if (isAuthenticated) {
        const roles = this.keycloakService.getUserRoles();
        if (roles.includes('admin')) {
          await this.router.navigate(['/admin']);
        } else {
          await this.router.navigate(['/user-profile']);
        }
      } else {
        await this.keycloakService.login();
      }
    } catch (error) {
      console.error("Errore durante la navigazione:", error);
    }
  }

  private logUserRoles(): void {
    const roles = this.keycloakService.getUserRoles();
    console.log('Ruoli utente attuali:', roles);
  }

  private redirectAdmin(): void {
    const roles = this.keycloakService.getUserRoles();
    if (roles.includes('admin')) {
      this.router.navigate(['/admin']);
    }
  }

  private getUserDetails(): void {
    const keycloak = this.keycloakService.getKeycloakInstance();
    this.userDetails = {
      email: keycloak.tokenParsed?.['email'],
      username: keycloak.tokenParsed?.['preferred_username'],
      firstName: keycloak.tokenParsed?.['given_name'],
      lastName: keycloak.tokenParsed?.['family_name'],
      keycloakId: keycloak.tokenParsed?.sub,
    };


    this.utenteService.checkUserExists(this.userDetails.username).subscribe({
      next: (exists: any) => {
        if (!exists) {
          this.saveUserToBackend(this.userDetails);
        } else {
          console.log('Utente già esistente nel backend.');
        }
      },
      error: (error: any) => {
        console.error('Errore durante il controllo dell\'utente:', error);
      }
    });
  }

  private saveUserToBackend(userDetails: any): void {
    this.utenteService.createUser(userDetails).subscribe({
      next: (response: any) => {
        console.log('Utente creato con successo:', response);
      },
      error: (error: { status: number; }) => {
        if (error.status === 409) {
          console.log('Utente già esistente nel backend.');
        } else {
          console.error('Errore nella creazione dell\'utente:', error);
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    console.log("Utente disconnesso");
  }
}

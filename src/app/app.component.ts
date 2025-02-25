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
  backgroundImage = "https://i.pinimg.com/736x/3e/45/d1/3e45d1580247e9aff0718387e5f6c7a8.jpg";
  isLoggedIn: boolean = false;

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

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    console.log(" Stato login:", this.isLoggedIn);

    if (this.isLoggedIn) {
      this.getUserDetails();
      this.logUserRoles();
      await this.authService.redirectUserByRole();
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

  testimonials = [
    { text: 'HospitalCare ha rivoluzionato la nostra gestione delle scorte di medicine. Altamente raccomandato', author: 'Dr. Bianchi S.' },
    { text: 'Grazie a HospitalCare, abbiamo ridotto gli stockout del 30%.', author: 'Dr. Ferrara L.' },
    { text: 'HospitalCare ci ha aiutato a migliorare l\'efficienza del nostro magazzino. Ora possiamo concentrarci di più sui pazienti e meno sulla logistica.', author: 'Dr. De Luca R.' },
    { text: 'La piattaforma è estremamente affidabile e ci ha permesso di risparmiare tempo e risorse. Consigliatissima', author: 'Dr. Gagliardi R.' },
    { text: 'Con HospitalCare, abbiamo ridotto i tempi di gestione delle scorte del 40%. Un vero cambiamento per la nostra struttura!', author: 'Dr. Filippelli  V.' },
    { text: 'La segnalazione automatica dei riordini è una funzionalità fantastica. Non dobbiamo più preoccuparci di rimanere senza scorte!', author: 'Dr. Molinari A.' },

  ];

  scrollIndex = 0;
  testimonialsPerPage = 3;

  get visibleTestimonials() {
    return this.testimonials.slice(this.scrollIndex, this.scrollIndex + this.testimonialsPerPage);
  }

  scrollCarousel(direction: number) {
    const maxScrollIndex = Math.max(0, this.testimonials.length - this.testimonialsPerPage);

    this.scrollIndex += direction * this.testimonialsPerPage;

    if (this.scrollIndex < 0) {
      this.scrollIndex = maxScrollIndex;
    } else if (this.scrollIndex > maxScrollIndex) {
      this.scrollIndex = 0;
    }
  }
}

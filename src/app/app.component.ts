import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router, Event} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { filter } from 'rxjs/operators';
import { NotificationsService } from './services/notifications.service';
import { AuthService } from './services/auth.service';
import { KeycloakService } from 'keycloak-angular';
import { UtenteService } from './services/utente.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hospitalCare';
  unreadNotifications: number = 0;
  searchKeyword: string = '';
  backgroundImage = "https://i.pinimg.com/736x/3e/45/d1/3e45d1580247e9aff0718387e5f6c7a8.jpg";
  userDetails: any;
  
  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
    private authService: AuthService,
    private keycloakService: KeycloakService,
    private utenteService: UtenteService
  ) {

    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (typeof document !== 'undefined') {
        }
      });
  }

  ngOnInit() {
    if(this.keycloakService.isLoggedIn()) {
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
      console.error('Errore durante il controllo dell\'autenticazione:', error);
    }
  }
  
  login() {
    this.keycloakService.login(); 
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

    console.log('Dati utente recuperati da Keycloak:');
    console.log('Email:', this.userDetails.email);
    console.log('Username:', this.userDetails.username);
    console.log('Nome:', this.userDetails.firstName);
    console.log('Cognome:', this.userDetails.lastName);
    console.log('Keycloak ID:', this.userDetails.keycloakId);


    this.utenteService.checkUserExists(this.userDetails.username).subscribe({
      next: (exists) => {
        if (!exists) {
          this.saveUserToBackend(this.userDetails);
        } else {
          console.log('Utente già esistente nel backend.');
        }
      },
      error: (error) => {
        console.error('Errore durante il controllo dell\'utente:', error);
      }
    });
  }

  private saveUserToBackend(userDetails: any): void {
    this.utenteService.createUser(userDetails).subscribe({
      next: (response) => {
        console.log('Utente creato con successo:', response);
      },
      error: (error) => {
        if (error.status === 409) {
          console.log('Utente già esistente nel backend.');
        } else {
          console.error('Errore nella creazione dell\'utente:', error);
        }
      }
    });
  }
  
  logout() {
    this.authService.logout();
  }

  /*searchMedicine(event: Event) {
    event.preventDefault();
    if (this.searchKeyword.trim() !== '') {
      this.router.navigate(['/warehouse'], { queryParams: { search: this.searchKeyword } });
    }
  }*/

  getUnreadNotifications(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.notificationsService.getUnreadCount(userId).subscribe(count => {
      this.unreadNotifications = count;
    });
  }

  goToWarehouse() {
    console.log("Navigazione verso /warehouse...");
    this.router.navigate(['/warehouse']);
  }

  testimonials = [
    { text: 'HospitalCare ha rivoluzionato la nostra gestione delle scorte di medicine. Altamente raccomandato', author: 'Dr. Sara B.' },
    { text: 'Grazie a HospitalCare, abbiamo ridotto gli stockout del 30%.', author: 'Dr. Marco L.' },
    { text: 'HospitalCare ci ha aiutato a migliorare l\'efficienza del nostro magazzino. Ora possiamo concentrarci di più sui pazienti e meno sulla logistica.', author: 'Dr. Anna R.' },
    { text: 'La piattaforma è estremamente affidabile e ci ha permesso di risparmiare tempo e risorse. Consigliatissima', author: 'Dr. Antonio R.' },
    { text: 'Con HospitalCare, abbiamo ridotto i tempi di gestione delle scorte del 40%. Un vero cambiamento per la nostra struttura!', author: 'Dr. Giovanni V.' },
    { text: 'La segnalazione automatica dei riordini è una funzionalità fantastica. Non dobbiamo più preoccuparci di rimanere senza scorte!', author: 'Dr. Luca A.' },

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

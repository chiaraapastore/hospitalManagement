import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { AuthenticationService } from '../auth/authenticationService';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import {NotificationService} from '../services/notification.service';
import { Utente } from '../models/utente';
import { HostListener } from '@angular/core';



@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  reparti: any[] = [];
  medicinali: any[] = [];
  pazienti: any[] = [];
  doctorUsername: string = '';
  unreadNotifications: number = 0;
  userId!: number;
  notifications: any[] = [];
  dropdownOpen: boolean = false;

  constructor(
    private doctorService: DoctorService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private keycloakService: KeycloakService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.caricaReparti();
    this.caricaPazienti();
    this.getDoctorUsername();
    this.listenForNewNotifications();
  }

  caricaReparti() {
    this.doctorService.visualizzaReferenzeReparto(1).subscribe((data: any[]) => {
      this.reparti = data;
    });
  }

  caricaPazienti() {
    this.doctorService.getPazienti().subscribe((data: any[]) => {
      this.pazienti = data;
    });
  }

  async getDoctorUsername() {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      if (isLoggedIn) {
        const userProfile = await this.keycloakService.loadUserProfile();
        this.doctorUsername = userProfile.username || 'Dottore';
        this.getUnreadNotifications();
      }
    } catch (error) {
      console.error('Errore nel recupero dell’utente:', error);
    }
  }

  getUnreadNotifications() {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.unreadNotifications = notifications.filter(n => !n.letta).length;
    });
  }

  getUserId() {
    this.authenticationService.getUserInfo().subscribe({
      next: (user: Utente) => {
        this.userId = user.id;
        this.loadNotifications();
        this.getDoctorUsername();
      },
      error: (err) => console.error('Errore nel recupero utente:', err)
    });
  }

  loadNotifications() {
    if (!this.userId) return;
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.unreadNotifications = notifications.filter(n => !n.letta).length;
      },
      error: (err) => console.error('Errore nel recupero notifiche:', err)
    });
  }


  markAsRead(notificationId: number, event: Event) {
    event.stopPropagation();
    this.notificationService.markNotificationAsRead(notificationId).subscribe(() => {
      this.loadNotifications();
    });
  }

  markAllAsRead(event: Event) {
    event.stopPropagation();
    this.notificationService.markAllNotificationsAsRead(this.userId).subscribe(() => {
      this.loadNotifications();
    });
  }
  deleteAllNotifications(event: Event) {
    event.stopPropagation();
    this.notifications = [];
    this.unreadNotifications = 0;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.loadNotifications();
    }
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!event.target || !(event.target as HTMLElement).closest('.notifications-wrapper')) {
      this.dropdownOpen = false;
    }
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} secondi fa`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minuti fa`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ore fa`;
    return `${Math.floor(diff / 86400)} giorni fa`;
  }

  listenForNewNotifications() {
    setInterval(() => {
      this.loadNotifications();
    }, 5000);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authenticationService.logout();
  }
}

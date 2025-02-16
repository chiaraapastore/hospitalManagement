import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { AuthenticationService } from '../auth/authenticationService';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import {NotificationService} from '../services/notification.service';
import { Notification } from '../models/notification';
import { HostListener } from '@angular/core';
import {HeadOfDepartmentService} from '../services/head-of-department.service';



@Component({
  selector: 'app-head-of-department',
  templateUrl: './head-of-department.component.html',
  styleUrls: ['./head-of-department.component.css']
})
export class HeadOfDepartmentComponent implements OnInit {
  reparti: any[] = [];
  medicinali: any[] = [];
  dottori: any[] = [];
  headOfDepartmentUsername: string = '';
  unreadNotifications: number = 0;
  userId!: number;
  notifications: Notification[] = [];
  dropdownOpen: boolean = false;
  selectedRepartoId!: number;
  selectedPatientName: string = '';

  constructor(
    private doctorService: DoctorService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private keycloakService: KeycloakService,
    private notificationService: NotificationService,
    private headOfDepartmentService: HeadOfDepartmentService,
  ) {}

  ngOnInit() {
    this.caricaReparti();
    this.caricaDottori();
    this.getHeadOfDepartmentUsername();
    this.listenForNewNotifications();
  }



  caricaReparti() {
    this.doctorService.visualizzaReferenzeReparto(1).subscribe((data: any[]) => {
      this.reparti = data;
    });
  }

  caricaDottori() {
    if (!this.selectedRepartoId) return;
    this.doctorService.getDottoriByReparto(this.selectedRepartoId).subscribe((data: any[]) => {
      this.dottori = data;
    });
  }

  async getHeadOfDepartmentUsername() {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      if (isLoggedIn) {
        const userProfile = await this.keycloakService.loadUserProfile();
        this.headOfDepartmentUsername = userProfile.username || 'Capo Reparto';
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


  loadNotifications() {
    if (!this.userId) return;
    this.notificationService.getNotificationsForChief(this.userId).subscribe({
      next: (notifications: any) => {
        this.notifications = notifications as Notification[];
        this.unreadNotifications = this.notifications.filter(n => n?.letta === false).length;
      },
      error: (err: any) => console.error('Errore nel recupero notifiche:', err)
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


  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} secondi fa`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minuti fa`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ore fa`;
    return `${Math.floor(diff / 86400)} giorni fa`;
  }
}

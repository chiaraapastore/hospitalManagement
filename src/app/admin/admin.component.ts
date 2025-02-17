import { Component, OnInit } from '@angular/core';
import { Dottore } from '../models/dottore';
import { AdminService } from '../services/admin.service';
import { NotificationService } from '../services/notification.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {AuthenticationService} from '../auth/authenticationService';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  adminUsername: string = '';
  unreadNotifications: number = 0;
  userId!: number;
  notifications: any[] = [];
  dropdownOpen: boolean = false;
  dottori: Dottore[] = [];
  reparti: any[] = [];
  selectedRepartoId!: number;

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    public authenticationService: AuthenticationService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAdminData();
    this.loadDottori();
    this.loadReparti();
    this.loadNotifications();
  }

  loadAdminData(): void {
    this.adminService.getUserInfo().subscribe({
      next: (data: any) => {
        this.adminUsername = data.username;
      },
      error: (err: any) => console.error("Errore nel caricamento dell'amministratore", err)
    });
  }

  loadDottori(): void {
    this.adminService.getDottori().subscribe({
      next: (data: Dottore[]) => {
        this.dottori = data;
      },
      error: (err: any) => console.error('Errore nel caricamento dei dottori', err)
    });
  }


  loadReparti(): void {
    this.adminService.getReparti().subscribe({
      next: (data: any[]) => {
        this.reparti = data;
      },
      error: (err: any) => console.error("Errore nel caricamento dei reparti", err)
    });
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data: any[]) => {
        this.notifications = data;
        this.unreadNotifications = data.filter(n => !n.letta).length;
      },
      error: (err: any) => console.error("Errore nel caricamento delle notifiche", err)
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

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
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

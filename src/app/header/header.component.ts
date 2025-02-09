import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  unreadNotifications: number = 0;
  notifications: any[] = [];
  showNotificationList: boolean = false;

  constructor(private authService: AuthService, private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.loadNotifications();

    setInterval(() => {
      this.loadNotifications();
    }, 30000);
  }


  loadNotifications(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      console.error("Errore: Nessun ID utente trovato.");
      return;
    }

    this.notificationsService.getUnreadCount(userId).subscribe({
      next: (count: number) => {
        this.unreadNotifications = count;
      },
      error: (err) => {
        console.error('Errore nel recupero delle notifiche:', err);
        this.unreadNotifications = 0;
      }
    });

    this.notificationsService.getUserNotifications(userId).subscribe({
      next: (notifications: any[]) => {
        this.notifications = notifications;
      },
      error: (err) => {
        console.error('Errore nel recupero della lista notifiche:', err);
      }
    });
  }

  showNotifications(): void {
    this.showNotificationList = !this.showNotificationList;
  }

  markNotificationAsRead(notificationId: number): void {
    this.notificationsService.markNotificationAsRead(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => n.id === notificationId ? { ...n, letta: true } : n);
        this.unreadNotifications = this.notifications.filter(n => !n.letta).length;
      },
      error: (err) => {
        console.error('Errore nel segnare la notifica come letta:', err);
      }
    });
  }

  markAllNotificationsAsRead(): void {
    this.notificationsService.markAllNotificationsAsReadForUser(1).subscribe({
      next: () => {
        this.unreadNotifications = 0;
        this.notifications.forEach(n => n.letta = true);
      },
      error: (err) => {
        console.error('Errore nel segnare le notifiche come lette:', err);
      }
    });
  }


  logout(): void {
    console.log("Logout eseguito!");
    this.authService.logout();
  }

}

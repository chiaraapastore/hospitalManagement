import { Component, OnInit } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessario per [(ngModel)]
import { NotificationsService } from './services/notifications.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hospitalManagement';
  unreadNotifications: number = 0;
  searchKeyword: string = '';

  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getUnreadNotifications();
  }

  goToUserProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
  }

  searchMedicine(event: Event) {
    event.preventDefault();
    if (this.searchKeyword.trim() !== '') {
      this.router.navigate(['/warehouse'], { queryParams: { search: this.searchKeyword } });
    }
  }

  getUnreadNotifications() {
    this.notificationsService.getUnreadCount().subscribe(count => {
      this.unreadNotifications = count;
    });
  }
}

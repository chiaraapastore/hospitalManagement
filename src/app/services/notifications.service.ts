import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = 'http://localhost:8081/api/notifications';

  constructor(private http: HttpClient) {}

  getUnreadCount(userId: number): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map(notifications => notifications.filter(n => !n.read).length)
    );
  }


  getUserNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  markNotificationAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-read/${notificationId}`, {});
  }

  markAllNotificationsAsReadForUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read/${userId}`, {});
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8081/api/notifications';
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchUserNotifications(): void {
    this.http.get<any[]>(`${this.apiUrl}/user/notifications`).subscribe({
      next: (notifications) => this.notificationsSubject.next(notifications),
      error: (err: any) => console.error('Errore nel recupero notifiche:', err)
    });
  }

  getNotifications(): Observable<any[]> {
    return this.notifications$;
  }

  markAllNotificationsAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read`, {}).pipe(
      catchError((err: any) => {
        console.error("Errore nel segnare tutte le notifiche come lette:", err);
        return throwError(() => new Error("Errore nel segnare tutte le notifiche come lette"));
      })
    );
  }

  sendNotification(receiverId: number, message: string, type: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/send`, null, {
      params: { receiverId: receiverId.toString(), message: message, type: type }
    }).pipe(
      catchError((err: any) => {
        console.error("Errore durante l'invio della notifica:", err);
        return throwError(() => new Error("Errore durante l'invio della notifica"));
      })
    );
  }
}

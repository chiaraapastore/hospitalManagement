import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8081/api/notifications';

  constructor(private http: HttpClient) {}

  markAllNotificationsAsRead(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/mark-all-read`, {}).pipe(
      catchError((err: any) => {
        console.error("Errore nel segnare tutte le notifiche come lette:", err);
        return throwError(() => new Error("Errore nel segnare tutte le notifiche come lette"));
      })
    );
  }

}

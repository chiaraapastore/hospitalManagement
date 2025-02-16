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


  fetchUserNotifications(userId: number): void {
    this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).subscribe({
      next: (notifications) => this.notificationsSubject.next(notifications),
      error: (err: any) => console.error('Errore nel recupero notifiche:', err)
    });
  }

  markNotificationAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-read/${notificationId}`, {}).pipe(
      catchError((err: any) => {
        console.error("Errore durante la lettura della notifica:", err);
        return throwError(() => new Error("Errore nella lettura della notifica"));
      })
    );
  }

  markAllNotificationsAsRead(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read/${userId}`, {}).pipe(
      catchError((err: any) => {
        console.error("Errore durante la lettura di tutte le notifiche:", err);
        return throwError(() => new Error("Errore nel segnare tutte le notifiche come lette"));
      })
    );
  }


  sendWelcomeNotification(userId: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/welcome/${userId}`, {});
  }


  notifyNewPatient(repartoId: number, patientName: string, chiefId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/new-patient`, null, {
      params: { repartoId: repartoId.toString(), patientName: patientName, chiefId: chiefId.toString() },
    });
  }

  getNotificationsForChief(chiefId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/capo-reparto/${chiefId}`);
  }


  getNotifications(): Observable<any[]> {
    return this.notifications$;
  }

  sendNotification(param: { messaggio: string; destinatario: string }) {
    return this.http.post<void>(`${this.apiUrl}/invia`, param).pipe(
      catchError((err: any) => {
        console.error("Errore durante l'invio della notifica:", err);
        return throwError(() => new Error("Errore durante l'invio della notifica"));
      })
    );
  }
}

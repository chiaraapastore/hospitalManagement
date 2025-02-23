import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Magazine} from '../models/medicinale';

@Injectable({
  providedIn: 'root',
})
export class HeadOfDepartmentService {
  private apiUrl = 'http://localhost:8081/api/capo-reparto';
  private apiAdmin = 'http://localhost:8081/api/admin';
  private urlDottore = 'http://localhost:8081/api/dottore';
  private urlUtente = 'http://localhost:8081/api/utente';
  constructor(private http: HttpClient) {}

  aggiornaScorteReparto(repartoId: number, medicinaId: number, nuovaQuantita: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/aggiorna-scorte/${repartoId}/${medicinaId}`, null, {
      params: { nuovaQuantita: nuovaQuantita.toString() },
    });
  }

  assegnaDottoreAReparto(dottoreId: number, repartoId: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/assegna-dottore-reparto`, null, {
      params: { dottoreId: dottoreId.toString(), repartoId: repartoId.toString() },
    });
  }

  inviaNotifica(repartoId: string, messaggio: string): Observable<any> {
    const payload = { messaggio };
    console.log("Invio notifica con payload:", payload);
    return this.http.post<any>(`${this.apiUrl}/notifica/${repartoId}`, payload);
  }

  getDottori(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dottori`);
  }

  getReparti(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reparti`);
  }


  getFerieDisponibili(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/ferie-disponibili`);
  }

  cambiaReparto(doctorId: number, nuovoRepartoId: number): Observable<void> {
    return this.http.put<void>(`${this.urlDottore}/cambia-reparto/${doctorId}/${nuovoRepartoId}`, {});
  }

  assegnaFerie(doctorId: number, dataFerie: string): Observable<void> {
    return this.http.put<void>(`${this.urlDottore}/assegna-ferie/${doctorId}`, {}, {
      params: { dataFerie: dataFerie }
    });
  }


  assegnaTurno(doctorId: number, turno: string): Observable<void> {
    return this.http.put<void>(`${this.urlDottore}/assegna-turno/${doctorId}`, {}, {
      params: { turno: turno }
    });
  }


  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.urlUtente}/user-info`).pipe(
      tap(data => console.log("Dati utente ricevuti:", data))
    );
  }

  aggiornaScorte(repartoId: number, medicinaId: number, nuovaQuantita: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/aggiorna-scorte/${repartoId}/${medicinaId}`, null, {
      params: { nuovaQuantita: nuovaQuantita.toString() }
    });
  }

  aggiungiFarmaco(medicinale: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/aggiungi-medicinale`, medicinale);
  }

  getMagazzini(): Observable<Magazine[]> {
    return this.http.get<Magazine[]>(`${this.apiAdmin}/magazzini`);
  }
}

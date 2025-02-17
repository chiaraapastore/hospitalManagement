import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8081/api/admin';
  private urlUtente = 'http://localhost:8081/api/utente';

  constructor(private http: HttpClient) {}

  creaReparto(nomeReparto: string): Observable<string> {
    const payload = { nomeReparto };
    return this.http.post<string>(`${this.apiUrl}/crea-reparto`, payload);
  }

  aggiungiDottoreAReparto(utenteId: number, repartoId: number): Observable<string> {
    const params = new HttpParams()
      .set('utenteId', utenteId.toString())
      .set('repartoId', repartoId.toString());
    return this.http.post<string>(`${this.apiUrl}/aggiungi-dottore-reparto`, null, { params });
  }

  assegnaCapoReparto(utenteId: number, repartoId: number): Observable<string> {
    const params = new HttpParams()
      .set('utenteId', utenteId.toString())
      .set('repartoId', repartoId.toString());
    return this.http.post<string>(`${this.apiUrl}/assegna-capo-reparto`, null, { params });
  }

  getDottori(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dottori`);
  }

  getReparti(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reparti`);
  }

  getUserInfo(): Observable<string> {
    return this.http.get<string>(`${this.urlUtente}/user-info`);
  }

  getCapoReparti(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/capo-reparti`);
  }



  creaDottore(param: { firstName: string; lastName: string; email: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/crea-dottore`, param);
  }

  creaCapoReparto(param: { firstName: string; lastName: string; email: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/crea-capo-reparto`, param);
  }
}

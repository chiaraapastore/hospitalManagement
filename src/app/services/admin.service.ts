import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

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
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeadOfDepartmentService {
  private apiUrl = 'http://localhost:8080/api/capo-reparto';

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

  inviaNotifica(repartoId: string, messaggio: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/notifica/${repartoId}`, messaggio);
  }

  getDottori(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dottori`);
  }
}

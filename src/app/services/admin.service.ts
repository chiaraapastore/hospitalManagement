import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {EMPTY, Observable, tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Magazine, Medicinale} from '../models/medicinale';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8081/api/admin';
  private urlUtente = 'http://localhost:8081/api/utente';

  constructor(private http: HttpClient, private toastr: ToastrService) {}


  aggiungiReparto(repartoNome: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crea-reparto`, { repartoNome })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = "Si è verificato un errore.";

          if (error.status === 400 && error.error && error.error.error) {
            errorMessage = error.error.error;
          }
          this.toastr.error(errorMessage);
          return EMPTY;
        })
      );
  }



  aggiungiDottoreAReparto(utenteId: number, repartoId: number): Observable<string> {
    const params = new HttpParams()
      .set('utenteId', utenteId.toString())
      .set('repartoId', repartoId.toString());
    return this.http.put<string>(`${this.apiUrl}/assegna-dottore-reparto/${utenteId}/${repartoId}`, null, { params });
  }

  assegnaCapoReparto(utenteId: number, repartoId: number): Observable<string> {
    return this.http.put<string>(
      `${this.apiUrl}/assegna-capo-reparto`,
      { utenteId, repartoId },
      { headers: { 'Content-Type': 'application/json' } }
    );
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

  creaDottore(param: { firstName: string; lastName: string; email: string; repartoNome: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/crea-dottore`, param);
  }


  creaCapoReparto(param: { firstName: string; lastName: string; email: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/crea-capo-reparto`, param);
  }


  getMagazzini(): Observable<Magazine[]> {
    return this.http.get<Magazine[]>(`${this.apiUrl}/magazzini`);
  }

  aggiungiFarmaco(farmacoDaAggiungere: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/aggiungi-farmaco`, farmacoDaAggiungere)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = "Errore durante l'aggiunta del farmaco.";
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          this.toastr.error(errorMessage);
          return EMPTY;
        })
      );
  }

  getEmergenze(): Observable<Medicinale[]> {
    return this.http.get<Medicinale[]>(`${this.apiUrl}/emergenze`);
  }

  getOrdini(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ordini`);
  }

  getReportConsumi(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/report-consumi`);
  }

  creaOrdine(ordine: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ordini`, ordine);
  }

  getStoricoOrdini(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/storico-ordini`);
  }


  aggiornaStatoOrdine(ordineId: number, stato: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/ordini/${ordineId}/stato`, { stato });
  }


}

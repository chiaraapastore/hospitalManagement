import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import {Dottore} from '../models/dottore';
import {Department} from '../models/utente';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8081/api/dottore';

  constructor(private http: HttpClient) {}

  visualizzaReferenzeReparto(repartoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/visualizza-medicine/${repartoId}`);
  }



  somministraMedicine(pazienteId: number, capoRepartoId: number, nomeMedicinale: string, quantita: number): Observable<any> {
    const body = {
      pazienteId: pazienteId,
      capoRepartoId: capoRepartoId,
      nomeMedicinale: nomeMedicinale,
      quantita: quantita
    };

    return this.http.post<any>(`${this.apiUrl}/somministra-medicine`, body);

  }



    getPazienti(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pazienti`);
  }

  getDottoriByReparto(repartoId: number): Observable<Dottore[]> {
    return this.http.get<Dottore[]>(`${this.apiUrl}/reparto/${repartoId}`);
  }

  scadenzaFarmaco(capoRepartoId: number, medicinaleId: number): Observable<void> {
    return this.http.post<void>('/scadenza', { capoRepartoId, medicinaleId });
  }

  getRepartoByEmailDottore(emailDottore: string): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${emailDottore}/reparto`);
  }

}

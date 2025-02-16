import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Dottore} from '../models/dottore';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8081/api/dottore';

  constructor(private http: HttpClient) {}

  visualizzaReferenzeReparto(repartoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/visualizza-medicine/${repartoId}`);
  }


  somministraMedicine(pazienteId: number, medicinaleId: number): Observable<any> {
    const params = new HttpParams()
      .set('pazienteId', pazienteId.toString())
      .set('medicinaleId', medicinaleId.toString());

    return this.http.post<any>(`${this.apiUrl}/somministra-medicine`, {}, { params });
  }

  getPazienti(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pazienti`);
  }

  getDottoriByReparto(repartoId: number): Observable<Dottore[]> {
    return this.http.get<Dottore[]>(`${this.apiUrl}/reparto/${repartoId}`);
  }

}

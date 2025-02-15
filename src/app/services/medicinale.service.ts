import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Medicinale {
  id: number;
  nome: string;
  quantita: number;
}

@Injectable({
  providedIn: 'root'
})
export class MedicinaleService {
  private baseUrl = 'http://localhost:8081/api/medicinali';

  constructor(private http: HttpClient) {}

  getMedicinaliDisponibili(): Observable<Medicinale[]> {
    return this.http.get<Medicinale[]>(`${this.baseUrl}/disponibili`);
  }

  updateQuantita(medicinaleId: number, quantita: number): Observable<Medicinale> {
    return this.http.put<Medicinale>(`${this.baseUrl}/${medicinaleId}/update-quantity`, quantita);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Medicinale {
  availableQuantity: number;
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

  getAllMedicinali(): Observable<Medicinale[]> {
    return this.http.get<Medicinale[]>(`${this.baseUrl}`);
  }

  getMedicinaleById(id: number): Observable<Medicinale> {
    return this.http.get<Medicinale>(`${this.baseUrl}/search/${id}`);
  }


  updateMedicinale(id: number, medicinale: Medicinale): Observable<Medicinale> {
    return this.http.put<Medicinale>(`${this.baseUrl}/${id}`, medicinale);
  }


  deleteMedicinale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}/`);
  }

  checkReorderPoint(id: number): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/${id}/check-reorder`);
  }

  updateAvailableQuantity(id: number, availableQuantity: number): Observable<Medicinale> {
    return this.http.put<Medicinale>(`${this.baseUrl}/${id}/update-available-quantity`, { availableQuantity });
  }
}

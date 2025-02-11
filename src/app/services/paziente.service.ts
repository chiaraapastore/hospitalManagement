import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Paziente} from '../models/paziente';

@Injectable({
  providedIn: 'root'
})
export class PazienteService {
  private apiUrl = 'http://localhost:8080/api/pazienti';

  constructor(private http: HttpClient) {}

  getAllPazienti(): Observable<Paziente[]> {
    return this.http.get<Paziente[]>(`${this.apiUrl}/all`);
  }


  getPazienteById(id: number): Observable<Paziente> {
    return this.http.get<Paziente>(`${this.apiUrl}/search/${id}`);
  }

  savePaziente(paziente: Paziente): Observable<Paziente> {
    return this.http.post<Paziente>(`${this.apiUrl}/save`, paziente);
  }

  deletePaziente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}

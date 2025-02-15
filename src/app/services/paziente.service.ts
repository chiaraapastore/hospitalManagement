import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Paziente} from '../models/paziente';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PazienteService {
  private apiUrl = 'http://localhost:8081/api/pazienti';

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Paziente[]> {
    return this.http.get<Paziente[]>(`${this.apiUrl}/all`);
  }

  getPatientsByDoctor(): Observable<Paziente[]> {
    return this.http.get<Paziente[]>('http://localhost:8081/api/dottore/pazienti');
  }


  downloadMedicalRecord(pazienteId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${pazienteId}/cartella-clinica`, {
      responseType: 'blob'
    });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private apiUrl = 'http://localhost:8081/api/patients';

  constructor(private http: HttpClient) {}

  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  assignPatientToDepartment(patientId: number, departmentId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${patientId}/assign/${departmentId}`, {});
  }
}

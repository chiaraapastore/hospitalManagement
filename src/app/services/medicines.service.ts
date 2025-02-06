import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MedicinesService {
  private apiUrl = 'http://localhost:8081/api/medicinali';

  constructor(private http: HttpClient) {}

  getMedicines(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
  }

  addMedicine(medicine: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save`, medicine);
  }

  updateMedicine(id: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/update-quantity`, { quantity });
  }

  deleteMedicine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}

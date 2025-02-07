import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Medicine {
  id: number;
  name: string;
  availableQuantity: number;
  reorderPoint: number;
}

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl = 'http://localhost:8081/api/magazine';

  constructor(private http: HttpClient) {}

  getMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`/stock`);
  }

  updateStock(medicineId: number, quantity: number): Observable<void> {
    return this.http.put<void>(`/update`, { medicineId, quantity });
  }
}

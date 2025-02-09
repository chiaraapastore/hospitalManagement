import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
  private apiUrl = 'http://localhost:8081/api/utente';

  constructor(private http: HttpClient) {}

  createUser(utenteShop: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, utenteShop);
  }

  getUserDetailsDataBase(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user-info`);
  }

  checkUserExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists?username=${username}`);
  }
}

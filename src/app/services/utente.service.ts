import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TokenRequest {
  username: string;
  password: string;
}

export interface Utente {
  id?: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
  private apiUrl = 'http://localhost:8080/api/utente';

  constructor(private http: HttpClient) {}


  loginUser(tokenRequest: TokenRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/login`, tokenRequest);
  }


  createUser(utente: Utente): Observable<Utente> {
    return this.http.post<Utente>(`${this.apiUrl}/register`, utente);
  }


  getUserInfo(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/user-info`);
  }


  getUtenteByEmail(email: string): Observable<Utente> {
    return this.http.get<Utente>(`${this.apiUrl}/utenti/${email}`);
  }


  updateUtente(id: number, utenteDetails: Utente): Observable<Utente> {
    return this.http.put<Utente>(`${this.apiUrl}/utenti/${id}`, utenteDetails);
  }


  deleteUtente(username: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${username}`);
  }


  getUserDetailsDataBase(): Observable<Utente> {
    return this.http.get<Utente>(`${this.apiUrl}/userDetailsDataBase`);
  }


  checkUserExists(username: string): Observable<boolean> {
    const params = new HttpParams().set('username', username);
    return this.http.get<boolean>(`${this.apiUrl}/exists`, { params });
  }
}

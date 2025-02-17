import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {EMPTY, Observable, tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8081/api/admin';
  private urlUtente = 'http://localhost:8081/api/utente';

  constructor(private http: HttpClient, private toastr: ToastrService) {}


  aggiungiReparto(repartoNome: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crea-reparto`, { repartoNome })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = "Si è verificato un errore.";

          if (error.status === 400 && error.error && error.error.error) {
            errorMessage = error.error.error;
          }
          this.toastr.error(errorMessage);
          return EMPTY;
        })
      );
  }



  aggiungiDottoreAReparto(utenteId: number, repartoId: number): Observable<string> {
    const params = new HttpParams()
      .set('utenteId', utenteId.toString())
      .set('repartoId', repartoId.toString());
    return this.http.post<string>(`${this.apiUrl}/aggiungi-dottore-reparto`, null, { params });
  }

  assegnaCapoReparto(utenteId: number, repartoId: number): Observable<string> {
    const params = new HttpParams()
      .set('utenteId', utenteId.toString())
      .set('repartoId', repartoId.toString());
    return this.http.post<string>(`${this.apiUrl}/assegna-capo-reparto`, null, { params });
  }

  getDottori(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dottori`);
  }

  getReparti(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reparti`);
  }

  getUserInfo(): Observable<string> {
    return this.http.get<string>(`${this.urlUtente}/user-info`);
  }

  getCapoReparti(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/capo-reparti`);
  }



  creaDottore(param: { firstName: string; lastName: string; email: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/crea-dottore`, param);
  }

  creaCapoReparto(param: { firstName: string; lastName: string; email: string }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/crea-capo-reparto`, param);
  }
}

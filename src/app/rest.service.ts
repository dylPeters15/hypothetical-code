import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

const endpoint = 'http://localhost:8000/api/v1/';
// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json'
//   })
// };
@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  sendLoginRequest(username, password): Observable<any> {
    let header:HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': username,
      'password':password
    });
    let httpOptions = {
      headers: header
    };
    return this.http.get(endpoint + 'login', httpOptions).pipe(map(this.extractData));
  }

  sendVerifyTokenRequest(usertoken): Observable<any> {
    console.log(usertoken);
    let header:HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authentication': usertoken
    });
    let httpOptions = {
      headers: header
    };
    return this.http.get(endpoint + 'verifytoken', httpOptions).pipe(map(this.extractData));
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

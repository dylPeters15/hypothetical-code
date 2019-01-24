import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { auth } from './auth.service'

const endpoint = 'http://localhost:8000/api/v1/';
@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private getHTTPOptions() {
    let header:HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': auth.getUsername(),
      'token':auth.getToken()
    });
    let httpOptions = {
      headers: header
    };
    return httpOptions;
  }

  sendLoginRequest(username, password): Observable<any> {
    //Use GET becuase we are requesting the user token
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

  sendChangePasswordRequest(myOldPassword, myNewPassword): Observable<any> {
    //Use PUT because we are requesting to modify the user object in database
    var body = {
      oldpassword: myOldPassword,
      newpassword: myNewPassword
    };
    return this.http.put(endpoint + 'change-password', body, this.getHTTPOptions()).pipe(map(this.extractData));
  }

  sendDeleteAccountRequest(password): Observable<any> {
    let header:HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': auth.getUsername(),
      'token':auth.getToken(),
      'password': password
    });
    let httpOptions = {
      headers: header
    };
    return this.http.delete(endpoint + 'delete-account', httpOptions).pipe(map(this.extractData));
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

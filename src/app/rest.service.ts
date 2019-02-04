import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { auth } from './auth.service'

const endpoint = 'https://vcm-8405.vm.duke.edu:8443/api/v1/';
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

  adminCreateNewUser(username, password): Observable<any> {
    return this.http.post(endpoint + 'create-user', {
      username: username,
      password: password
    }, this.getHTTPOptions());
  }

  adminCreateSku(name, sku_number, case_upc_number, unit_upc_number, unit_size, count_per_case, product_line,ingredients, comment): Observable<any> {
    return this.http.post(endpoint + 'sku-inventory', {
      name: name,
      skuNumber: sku_number,
      caseUpcNumber: case_upc_number,
      unitUpcNumber: unit_upc_number,
      unitSize: unit_size,
      countPerCase: count_per_case,
      productLine: product_line,
      ingredientTuples: ingredients,
      comment: comment
    }, this.getHTTPOptions());
  }

  getSkus(): Observable<any> {
    console.log("We made it here fam");
    return this.http.get(endpoint + 'sku-inventory').pipe(map(this.extractData));
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

  sendUserListRequest(): Observable<any> {
    return this.http.get(endpoint + 'user-list', this.getHTTPOptions()).pipe(map(this.extractData));
  }

  sendAdminDeleteUserRequest(usernameToDelete): Observable<any> {
    let header:HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': auth.getUsername(),
      'token':auth.getToken(),
      'usernametodelete': usernameToDelete
    });
    let httpOptions = {
      headers: header
    };
    return this.http.delete(endpoint + 'admin-delete-user', httpOptions).pipe(map(this.extractData));
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { auth } from './auth.service'

//const endpoint = 'https://vcm-8238.vm.duke.edu:8443/api/v1/';
// Noah: const endpoint = 'https://vcm-8405.vm.duke.edu:8443/api/v1/';
const endpoint = 'https://localhost:8443/api/v1/';

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

  adminCreateSku(name, sku_number, case_upc_number, unit_upc_number, unit_size, count_per_case, product_line,ingredients, comment, id): Observable<any> {
    var body = {
      name: name,
      skuNumber: parseInt(sku_number),
      caseUpcNumber: case_upc_number,
      unitUpcNumber: unit_upc_number,
      unitSize: unit_size,
      countPerCase: parseInt(count_per_case),
      productLine: product_line,
      ingredientTuples: ingredients.split(","),
      comment: comment,
      id: id
    };
    console.log(body);
    console.log(JSON.stringify(body));
    var response = this.http.post(endpoint + 'sku-inventory', body, this.getHTTPOptions()).pipe(map(this.extractData));
    response.subscribe(response => {
      console.log("subscribed response: " + JSON.stringify(response));
    });
    return response;
  }

  modifySkuRequest(name, sku_number, case_upc_number, unit_upc_number, unit_size, count_per_case, product_line, ingredients, comment, id): Observable<any> {
    //Use PUT because we are requesting to modify the user object in database
    var body = {
      name: name,
      sku_number: sku_number,
      case_upc_number: case_upc_number,
      unit_upc_number: unit_upc_number,
      unit_size: unit_size,
      count_per_case: count_per_case,
      product_line: product_line,
      ingredients: ingredients,
      comment: comment,
      id: id
    };
    var response = this.http.put(endpoint + 'change-sku', body, this.getHTTPOptions()).pipe(map(this.extractData));
    console.log("Response: " + response);
    return response;
  }

  upload(files)
  {
    var toreturn = [];
    console.log(files);
    files.forEach(file => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        var result = JSON.stringify(fileReader.result);
        result = result.substring(1,result.length-1);
        console.log("Result: " + result);

        var splitbyquotes = result.split("\\\"");
        var firsthalfsplit = splitbyquotes[0].split(",");
        var secondhalfsplit = splitbyquotes[2].split(",");
        console.log(splitbyquotes);
        console.log(firsthalfsplit);
        console.log(secondhalfsplit);
        console.log(JSON.stringify(splitbyquotes));
        toreturn.push(this.adminCreateSku(firsthalfsplit[0], firsthalfsplit[1], firsthalfsplit[2], firsthalfsplit[3], firsthalfsplit[4], firsthalfsplit[5], firsthalfsplit[6], splitbyquotes[1], secondhalfsplit[1], this.generateId()));
      }
      fileReader.readAsText(file);


      // create a new multipart-form for every file
      // const formData: FormData = new FormData();
      // formData.append("file", file, file.name);
      // return this.http.post(endpoint + 'my-file', {
      //   name: file.name,
      //   file: file
      // }, this.getHTTPOptions());
    });
    return toreturn
  }

  generateId() {
    var id =  Math.floor((Math.random() * 1000000) + 1);
    console.log("ID: " + id);
    return id;
  }

  adminCreateIngredient(name, number, vendor_information, package_size, cost_per_package, comment): Observable<any> {
    return this.http.post(endpoint + 'ingredient-inventory', {
      name: name,
      number: number,
      venderInformation: vendor_information,
      packageSize: package_size,
      costPerPackage: cost_per_package,
      comment: comment,
    }, this.getHTTPOptions());
  }

  createGoal(name, skus, quantities, date){
    console.log("Name: " + name + " SKUS: " + skus + " Quants: " + quantities + " Date: " +date);
    return this.http.post(endpoint + 'manufacturing-goals',{
      name: name,
      skus: skus,
      quantities: quantities,
      date: date
    }, this.getHTTPOptions());
  }

  getSkus(): Observable<any> {
    return this.http.get(endpoint + 'sku-inventory').pipe(map(this.extractData));
  }

  getIngredients(): Observable<any> {
    return this.http.get(endpoint + 'ingredient-inventory').pipe(map(this.extractData));
  }

  getIngredientByNumber(ingredientNumber): Observable<any>{
    let header:HttpHeaders = new HttpHeaders({
      'number': ingredientNumber
    });
    let httpOptions = {
      headers: header
    }
    console.log(ingredientNumber)
    return this.http.get(endpoint + 'get-ingredient-by-number', httpOptions).pipe(map(this.extractData));
  }

  addIngredientSku(ingredient, skus): Observable<any> {
    var body = {
      ingredient: ingredient,
      skus: skus
    }
    return this.http.put(endpoint + 'add-ingredient-sku', body, this.getHTTPOptions()).pipe(map(this.extractData));
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

  getGoals(): Observable<any> {
    return this.http.get(endpoint + 'manufacturing-goals').pipe(map(this.extractData));
  }

  getGoalByName(goalName): Observable<any>{
    let header:HttpHeaders = new HttpHeaders({
      'name': goalName
    });
    let httpOptions = {
      headers: header
    }
    return this.http.get(endpoint + 'get-goal-by-name', httpOptions)
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

  sendAdminDeleteSkuRequest(nameToDelete): Observable<any> {
    let header:HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': auth.getUsername(),
      'token':auth.getToken(),
      'nametodelete': nameToDelete
    });
    let httpOptions = {
      headers: header
    };
    return this.http.delete(endpoint + 'admin-delete-sku', httpOptions).pipe(map(this.extractData));
  }

  sendAdminDeleteIngredientRequest(nameToDelete): Observable<any> {
    let header:HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': auth.getUsername(),
      'token':auth.getToken(),
      'nametodelete': nameToDelete
    });
    let httpOptions = {
      headers: header
    };
    return this.http.delete(endpoint + 'admin-delete-ingredient', httpOptions).pipe(map(this.extractData));
  }
  sendDeleteGoalRequest(name): Observable<any> {
    let header:HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': auth.getUsername(),
      'token':auth.getToken(),
      'nametodelete': name
    });
    let httpOptions = {
      headers: header
    };
    return this.http.delete(endpoint + 'delete-goal', httpOptions).pipe(map(this.extractData));
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

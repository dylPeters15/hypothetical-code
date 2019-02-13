import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { auth } from './auth.service'
import { Observable } from 'rxjs';

// const endpoint = 'https://vcm-8238.vm.duke.edu:8443/'; // Ben
// const endpoint = 'https://vcm-8405.vm.duke.edu:8443/'; // Noah
const endpoint = 'https://localhost:8443/'; // localhost

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  private generateHeader(options?) {
    options = options || {};
    options['Content-Type'] = 'application/json';
    options['token'] = auth.getToken();
    return {
      headers: new HttpHeaders(options)
    };
  }

  loginRequest(username, password): Observable<any> {
    return this.http.get(endpoint + 'login', {
      headers: new HttpHeaders({
        username: username,
        password: password
      })
    });
  }

  getNetID(token): Observable<any> {
    return this.http.get('https://api.colab.duke.edu/identity/v1/', {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'x-api-key': 'api-docs',
        'Authorization': 'Bearer '+token
      })
    });
  }

  ///////////////////// users /////////////////////
  getUsers(username: string, usernameregex: string, admin: boolean, limit: number): Observable<any> {
    return this.http.get(endpoint + 'users', this.generateHeader({
      username: username,
      usernameregex: usernameregex,
      admin: admin==null?"":""+admin,
      limit: ""+limit
    }));
  }

  createUser(username: string, password: string, admin: boolean): Observable<any> {
    return this.http.put(endpoint + 'users', {
      username: username,
      password: password,
      admin: admin
    },
      this.generateHeader());
  }

  modifyUser(username: string, newpassword: string, newadmin: boolean): Observable<any> {
    return this.http.post(endpoint + 'users', {
      password: newpassword||"",
      admin: newadmin==null?"":newadmin
    },
      this.generateHeader({
        username: username
      }));
  }

  deleteUser(username: string): Observable<any> {
    return this.http.delete(endpoint + 'users', this.generateHeader({
      username: username
    }));
  }

  ///////////////////// formulas /////////////////////
  getFormulas(sku: number, ingredient: number, limit: number): Observable<any> {
    return this.http.get(endpoint + "formulas", this.generateHeader({
      sku: sku,
      ingredient: ingredient,
      limit: limit
    }));
  }

  createFormula(sku: number, ingredient: number, quantity: number): Observable<any> {
    return this.http.put(endpoint + "formulas", {
      sku: sku,
      ingredient: ingredient,
      quantity: quantity
    },
    this.generateHeader());
  }

  modifyFormula(sku: number, ingredient: number, newQuantity: number): Observable<any> {
    return this.http.post(endpoint + "formulas", {
      sku: sku,
      ingredient: ingredient,
      quantity: newQuantity
    },
    this.generateHeader({
      sku: sku,
      ingredient: ingredient
    }));
  }

  deleteFormula(sku: number, ingredient: number): Observable<any> {
    return this.http.delete(endpoint + "formulas", this.generateHeader({
      sku: sku,
      ingredient: ingredient
    }));
  }










  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // Do not uncomment the lines below. They are just there for reference as we implement the new API
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // private extractData(res: Response) {
  //   let body = res;
  //   return body || {};
  // }

  // private getHTTPOptions() {
  //   let header:HttpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'username': auth.getUsername(),
  //     'token':auth.getToken()
  //   });
  //   let httpOptions = {
  //     headers: header
  //   };
  //   return httpOptions;
  // }

  // adminCreateNewUser(username, password): Observable<any> {
  //   return this.http.post(endpoint + 'create-user', {
  //     username: username,
  //     password: password
  //   }, this.getHTTPOptions());
  // }

  // adminCreateProductLine(name, skus, id): Observable<any> {
  //   console.log("Adding a new product line haha");
  //   return this.http.post(endpoint + 'product-line', {
  //     name: name,
  //     skus: skus,
  //     id: id
  //   }, this.getHTTPOptions());
  // }

  // modifyProductLineRequest(name, skus, id): Observable<any> {
  //   //Use PUT because we are requesting to modify the user object in database
  //   var body = {
  //     name: name,
  //     skus: skus,
  //     id: id
  //   };
  //   return this.http.put(endpoint + 'change-product-line', body, this.getHTTPOptions()).pipe(map(this.extractData));
  // }
  // checkForSkuCollision(sku): Observable<any> {
  //   sku['username'] = auth.getUsername();
  //   sku['token'] = auth.getToken();
  //   sku['Content-Type'] = 'application/json';
  //   let header:HttpHeaders = new HttpHeaders(sku);
  //   let httpOptions = {
  //     headers: header
  //   };
  //   return this.http.get(endpoint + "find-sku-collision", httpOptions).pipe(map(this.extractData));
  // }

  // adminCreateSku(name, sku_number, case_upc_number, unit_upc_number, unit_size, count_per_case, product_line,ingredients, comment, id): Observable<any> {
  //   var body = {
  //     name: name,
  //     skuNumber: sku_number,
  //     caseUpcNumber: case_upc_number,
  //     unitUpcNumber: unit_upc_number,
  //     unitSize: unit_size,
  //     countPerCase: count_per_case,
  //     productLine: product_line,
  //     ingredientTuples: ingredients,
  //     comment: comment,
  //     id: id
  //   };
  //   var response = this.http.post(endpoint + 'sku-inventory', body, this.getHTTPOptions()).pipe(map(this.extractData));
  //   return response;
  // }

  // modifySkuRequest(name, sku_number, case_upc_number, unit_upc_number, unit_size, count_per_case, product_line, ingredients, comment, id): Observable<any> {
  //   //Use PUT because we are requesting to modify the user object in database
  //   var body = {
  //     name: name,
  //     sku_number: sku_number,
  //     case_upc_number: case_upc_number,
  //     unit_upc_number: unit_upc_number,
  //     unit_size: unit_size,
  //     count_per_case: count_per_case,
  //     product_line: product_line,
  //     ingredients: ingredients,
  //     comment: comment,
  //     id: id
  //   };
  //   var response = this.http.put(endpoint + 'change-sku', body, this.getHTTPOptions()).pipe(map(this.extractData));
  //   console.log("Response: "); + response
  //   console.log(response);
  //   return response;
  // }

  // generateId() {
  //   var id =  Math.floor((Math.random() * 1000000) + 1);
  //   return id;
  // }

  // adminCreateIngredient(name, number, vendor_information, package_size, cost_per_package, comment, skus, id): Observable<any> {
  //   return this.http.post(endpoint + 'ingredient-inventory', {
  //     name: name,
  //     number: number,
  //     vendorInformation: vendor_information,
  //     packageSize: package_size,
  //     costPerPackage: cost_per_package,
  //     comment: comment,
  //     skus: skus,
  //     id: id,
  //   }, this.getHTTPOptions());
  // }

  // modifyIngredientRequest(name, number, vendorInformation, packageSize, costPerPackage, comment, id): Observable<any> {
  //   //Use PUT because we are requesting to modify the user object in database
  //   var body = {
  //     name: name,
  //     number: number,
  //     vendorInformation: vendorInformation,
  //     packageSize: packageSize,
  //     costPerPackage: costPerPackage,
  //     comment: comment,
  //     id: id
  //   };
  //   return this.http.put(endpoint + 'change-ingredient', body, this.getHTTPOptions()).pipe(map(this.extractData));
  // }

  // createGoal(name, skus, quantities, date){
  //   return this.http.post(endpoint + 'manufacturing-goals',{
  //     user: auth.getUsername,
  //     name: name,
  //     skus: skus,
  //     quantities: quantities,
  //     date: date
  //   }, this.getHTTPOptions());
  // }

  // getSkus(): Observable<any> {
  //   return this.http.get(endpoint + 'sku-inventory').pipe(map(this.extractData));
  // }

  // getProductLines(): Observable<any> {
  //   return this.http.get(endpoint + 'product-line').pipe(map(this.extractData));
  // }

  // getIngredients(): Observable<any> {
  //   return this.http.get(endpoint + 'ingredient-inventory').pipe(map(this.extractData));
  // }

  // getIngredientByNumber(ingredientNumber): Observable<any>{
  //   let header:HttpHeaders = new HttpHeaders({
  //     'number': ingredientNumber
  //   });
  //   let httpOptions = {
  //     headers: header
  //   }
  //   console.log(ingredientNumber);
  //   return this.http.get(endpoint + 'get-ingredient-by-number', httpOptions).pipe(map(this.extractData));
  // }

  // getIngredientById(ingredientId): Observable<any>{
  //   let header:HttpHeaders = new HttpHeaders({
  //     'ingredientid': ingredientId
  //   });
  //   let httpOptions = {
  //     headers: header
  //   }
  //   console.log(httpOptions.headers);
  //   console.log("ID: ", ingredientId);
  //   return this.http.get(endpoint + 'get-ingredient-by-id', httpOptions).pipe(map(this.extractData));
  // }

  // getSkuIdFromName(input_name): Observable<any>{
  //   let header:HttpHeaders = new HttpHeaders({
  //     'name': input_name
  //   });
  //   let httpOptions = {
  //     headers: header
  //   }
  //   return this.http.get(endpoint + 'get-skuid-by-name', httpOptions).pipe(map(this.extractData));
  // }

  // getSkuInfoFromId(input_id): Observable<any>{
  //   let header:HttpHeaders = new HttpHeaders({
  //     'id': input_id
  //   });
  //   let httpOptions = {
  //     headers: header
  //   }
  //   console.log("at this stage, is is " + input_id);
  //   return this.http.get(endpoint + 'get-skuinfo-by-id', httpOptions).pipe(map(this.extractData));
  // }

  // getIngredientIdFromName(input_name): Observable<any>{
  //   console.log("rest", input_name)
  //   let header:HttpHeaders = new HttpHeaders({
  //     'name': input_name
  //   });
  //   let httpOptions = {
  //     headers: header
  //   }
  //   return this.http.get(endpoint + 'get-ingredientid-by-name', httpOptions).pipe(map(this.extractData));
  // }

  // addIngredientSku(ingredient, skus): Observable<any> {
  //   var body = {
  //     ingredient: ingredient,
  //     skus: skus
  //   }
  //   return this.http.put(endpoint + 'add-ingredient-sku', body, this.getHTTPOptions()).pipe(map(this.extractData));
  // }

  // addProductLine(ingredient, skus): Observable<any> {
  //   var body = {
  //     ingredient: ingredient,
  //     skus: skus
  //   }
  //   return this.http.put(endpoint + 'add-ingredient-sku', body, this.getHTTPOptions()).pipe(map(this.extractData));
  // }

  // sendLoginRequest(username, password): Observable<any> {
  //   //Use GET becuase we are requesting the user token
  //   let header:HttpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'username': username,
  //     'password':password
  //   });
  //   let httpOptions = {
  //     headers: header
  //   };
  //   return this.http.get(endpoint + 'login', httpOptions).pipe(map(this.extractData));
  // }

  // sendChangePasswordRequest(myOldPassword, myNewPassword): Observable<any> {
  //   //Use PUT because we are requesting to modify the user object in database
  //   var body = {
  //     oldpassword: myOldPassword,
  //     newpassword: myNewPassword
  //   };
  //   return this.http.put(endpoint + 'change-password', body, this.getHTTPOptions()).pipe(map(this.extractData));
  // }

  // sendDeleteAccountRequest(password): Observable<any> {
  //   let header:HttpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'username': auth.getUsername(),
  //     'token':auth.getToken(),
  //     'password': password
  //   });
  //   let httpOptions = {
  //     headers: header
  //   };
  //   return this.http.delete(endpoint + 'delete-account', httpOptions).pipe(map(this.extractData));
  // }

  // getGoals(): Observable<any> {
  //   let header:HttpHeaders = new HttpHeaders({
  //     'username': auth.getUsername()
  //   });
  //   let httpOptions = {
  //     headers: header
  //   };
  //   return this.http.get(endpoint + 'manufacturing-goals', httpOptions).pipe(map(this.extractData));
  // }

  // getGoalByName(goalName): Observable<any>{
  //   let header:HttpHeaders = new HttpHeaders({
  //     'name': goalName
  //   });
  //   let httpOptions = {
  //     headers: header
  //   }
  //   return this.http.get(endpoint + 'get-goal-by-name', httpOptions)
  // }

  // sendUserListRequest(): Observable<any> {
  //   return this.http.get(endpoint + 'user-list', this.getHTTPOptions()).pipe(map(this.extractData));
  // }

  // sendAdminDeleteUserRequest(usernameToDelete): Observable<any> {
  //   let header:HttpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'username': auth.getUsername(),
  //     'token':auth.getToken(),
  //     'usernametodelete': usernameToDelete
  //   });
  //   let httpOptions = {
  //     headers: header
  //   };
  //   return this.http.delete(endpoint + 'admin-delete-user', httpOptions).pipe(map(this.extractData));
  // }

  // sendAdminDeleteSkuRequest(nameToDelete): Observable<any> {
  //   let header:HttpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'username': auth.getUsername(),
  //     'token':auth.getToken(),
  //     'nametodelete': nameToDelete
  //   });
  //   let httpOptions = {
  //     headers: header
  //   };
  //   return this.http.delete(endpoint + 'admin-delete-sku', httpOptions).pipe(map(this.extractData));
  // }

  // sendAdminDeleteProductLineRequest(nameToDelete): Observable<any> {
  //   let header:HttpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'username': auth.getUsername(),
  //     'token':auth.getToken(),
  //     'nametodelete': nameToDelete
  //   });
  //   let httpOptions = {
  //     headers: header
  //   };
  //   return this.http.delete(endpoint + 'admin-delete-product-line', httpOptions).pipe(map(this.extractData));
  // }

  // sendAdminDeleteIngredientRequest(nameToDelete): Observable<any> {
  //   let header:HttpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'username': auth.getUsername(),
  //     'token':auth.getToken(),
  //     'nametodelete': nameToDelete
  //   });
  //   let httpOptions = {
  //     headers: header
  //   };
  //   return this.http.delete(endpoint + 'admin-delete-ingredient', httpOptions).pipe(map(this.extractData));
  // }
  // sendDeleteGoalRequest(name): Observable<any> {
  //   let header:HttpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'username': auth.getUsername(),
  //     'token':auth.getToken(),
  //     'nametodelete': name
  //   });
  //   let httpOptions = {
  //     headers: header
  //   };
  //   return this.http.delete(endpoint + 'delete-goal', httpOptions).pipe(map(this.extractData));
  // }
  // private handleError<T> (operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {

  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead

  //     // TODO: better job of transforming error for user consumption
  //     console.log(`${operation} failed: ${error.message}`);

  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }
}

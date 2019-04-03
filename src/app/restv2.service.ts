import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { auth } from './auth.service';
import { RestService } from './rest.service';

const endpoint = RestService.endpoint + "api/v2/";

export enum AndVsOr {
  AND = '$and',
  OR = '$or'
}

@Injectable({
  providedIn: 'root'
})
export class RestServiceV2 {

  constructor(private http: HttpClient) { }

  ///////////////////// Utilities /////////////////////
  private generateHeaderWithFilterSchema(andVsOr?: AndVsOr, optionsIn?: any, limit?: number) {
    if (optionsIn && !(andVsOr == AndVsOr.AND || andVsOr == AndVsOr.OR)) {
      throw Error("If you are passing non-null options to the rest call you must pass a non-null value specifying AND vs OR.");
    }

    var headersOptions = {
      'Content-Type': 'application/json',
      'token': auth.getToken()
    };

    headersOptions['andvsor'] = AndVsOr.OR;
    headersOptions['andorclause'] = [];
    if (limit) {
      headersOptions['limit'] = JSON.stringify(limit);
    }
    if (andVsOr && optionsIn) {
      headersOptions['andvsor'] = andVsOr;
      for (let clause of optionsIn) {
        for (let key of Object.keys(clause)) {
          if (clause[key] !== null) {
            headersOptions['andorclause'].push(clause);
          }
        }
      }
    }

    headersOptions['andvsor'] = headersOptions['andvsor'];
    headersOptions['andorclause'] = encodeURIComponent(JSON.stringify(headersOptions['andorclause']));
    let httpHeaders: HttpHeaders = new HttpHeaders(headersOptions);
    let httpOptions = {
      headers: httpHeaders
    };
    return httpOptions;
  }

  generateBodyWithOptions(options) {
    var body = {
      $set: {}
    };
    for (let key of Object.keys(options)) {
      if (options[key] !== null) {
        body['$set'][key] = options[key];
      }
    }
    return body;
  }

  ///////////////////// users /////////////////////
  getUsers(andVsOr: AndVsOr, username: string, usernameregex: string, analyst: boolean, productmanager: boolean, businessmanager: boolean, manufacturinglineidtomanage: string, admin: boolean, localuser: boolean, limit: number): Promise<any> {
    var header = this.generateHeaderWithFilterSchema(andVsOr, [
      { username: username },
      { username: usernameregex?{ $regex: usernameregex }:null },
      { analyst: analyst },
      { productmanager: productmanager },
      { businessmanager: businessmanager },
      { manufacturinglineidtomanage: manufacturinglineidtomanage },
      { admin: admin },
      { localuser: localuser }
    ], limit);
    console.log(header);
    return this.http.get(endpoint + 'users', header).toPromise();
  }

  createUser(username: string, password: string, analyst: boolean, productmanager: boolean, businessmanager: boolean, manufacturinglinestomanage: any[], admin: boolean): Promise<any> {
    return this.http.put(endpoint + 'users', {
      username: username,
      password: password,
      analyst: analyst,
      productmanager: productmanager,
      businessmanager: businessmanager,
      manufacturinglinestomanage: manufacturinglinestomanage,
      admin: admin,
      localuser: true
    },
      this.generateHeaderWithFilterSchema()).toPromise();
  }

  modifyUser(andVsOr: AndVsOr, username: string, localuser: boolean, newpassword: string, newanalyst: boolean, newproductmanager: boolean, newbusinessmanager: boolean, newmanufacturinglinestomanage: any[], newadmin: boolean): Promise<any> {
    return this.http.post(endpoint + 'users', this.generateBodyWithOptions({
      password: newpassword,
      analyst: newanalyst,
      productmanager: newproductmanager,
      businessmanager: newbusinessmanager,
      manufacturinglinestomanage: newmanufacturinglinestomanage,
      admin: newadmin
    }),
      this.generateHeaderWithFilterSchema(andVsOr, [
        {username: username},
        {localuser: localuser}
      ])).toPromise();
  }

  deleteUser(andVsOr: AndVsOr, username: string, localuser: boolean): Promise<any> {
    return this.http.delete(endpoint + 'users', this.generateHeaderWithFilterSchema(andVsOr, [
      {username: username},
      {localuser: localuser}
    ])).toPromise();
  }

  ///////////////////// formulas /////////////////////
  getFormulas(andVsOr: AndVsOr, formulaname: string, formulanameregex: string, formulanumber: number, ingredientid: string, skuid: string, limit: number): Promise<any> {
    return this.http.get(endpoint + "formulas", this.generateHeaderWithFilterSchema(andVsOr, [
      {formulaname: formulaname},
      {formulaname: formulanameregex?{$regex: formulanameregex}:null},
      {formulanumber: formulanumber},
      {ingredientid: ingredientid},
      {skuid: skuid}
    ], limit)).toPromise();
  }

  createFormula(formulaname: string, formulanumber: Number, ingredientsandquantities: any[], comment: string): Promise<any> {
    return this.http.put(endpoint + "formulas", {
      formulaname: formulaname,
      formulanumber: formulanumber,
      ingredientsandquantities: ingredientsandquantities,
      comment: comment
    },
      this.generateHeaderWithFilterSchema()).toPromise();
  }

  modifyFormula(andVsOr: AndVsOr, oldname: string, formulaname: string, formulanumber: number, ingredientsandquantities: any[], comment: string): Promise<any> {
    return this.http.post(endpoint + "formulas", this.generateBodyWithOptions
    ({
      formulaname: formulaname,
      formulanumber: formulanumber,
      ingredientsandquantities: ingredientsandquantities,
      comment: comment
    }),
      this.generateHeaderWithFilterSchema(andVsOr, [
        {formulaname: oldname}
      ])).toPromise();
  }

  deleteFormula(andVsOr: AndVsOr, formulanumber: number): Promise<any> {
    return this.http.delete(endpoint + "formulas", this.generateHeaderWithFilterSchema(andVsOr, [
      {formulanumber: formulanumber}
    ])).toPromise();
  }

  ///////////////////// skus /////////////////////
  getSkus(andVsOr: AndVsOr, skuName: string, skunameregex: string, skuNumber: number, caseUpcNumber: number, unitUpcNumber: number, formula: string, limit: number): Promise<any> {

    return this.http.get(endpoint + "skus", this.generateHeaderWithFilterSchema(andVsOr, [
      {skuname: skuName},
      {skuname: skunameregex?{$regex: skunameregex}:null},
      {skunumber: skuNumber},
      {caseupcnumber: caseUpcNumber},
      {unitupcnumber: unitUpcNumber},
      {formula: formula}
    ], limit)).toPromise();
  }

  createSku(skuname: string, skunumber: number,
    caseupcnumber: number, unitupcnumber: number, unitsize: string,
    countpercase: number, formulaid: string, formulascalingfactor: Number, manufacturingrate: Number, manufacturingsetupcost: Number, manufacturingruncost: Number, comment: string): Promise<any> {
    return this.http.put(endpoint + "skus", {
      skuname: skuname,
      skunumber: skunumber,
      caseupcnumber: caseupcnumber,
      unitupcnumber: unitupcnumber,
      unitsize: unitsize,
      countpercase: countpercase,
      formula: formulaid,
      formulascalingfactor: formulascalingfactor,
      manufacturingrate: manufacturingrate,
      manufacturingsetupcost: manufacturingsetupcost,
      manufacturingruncost: manufacturingruncost,
      comment: comment
    },
      this.generateHeaderWithFilterSchema()).toPromise();
  }

  modifySku(andVsOr: AndVsOr, oldSkuName: string, skuname: string, skunumber: number,
    caseupcnumber: number, unitupcnumber: number, unitsize: string,
    countpercase: number, formulaid: string, formulascalingfactor: Number, manufacturingrate: Number, manufacturingsetupcost: Number, manufacturingruncost: Number, comment: string): Promise<any> {
    return this.http.post(endpoint + "skus", this.generateBodyWithOptions({
      skuname: skuname,
      skunumber: skunumber,
      caseupcnumber: caseupcnumber,
      unitupcnumber: unitupcnumber,
      unitsize: unitsize,
      countpercase: countpercase,
      formula: formulaid,
      formulascalingfactor: formulascalingfactor,
      manufacturingrate: manufacturingrate,
      manufacturingsetupcost: manufacturingsetupcost,
      manufacturingruncost: manufacturingruncost,
      comment: comment
    }),
      this.generateHeaderWithFilterSchema(andVsOr, [
        {skuname: oldSkuName}
      ])).toPromise();
  }

  deleteSku(andVsOr: AndVsOr, skuName: string): Promise<any> {
    return this.http.delete(endpoint + "skus", this.generateHeaderWithFilterSchema(andVsOr, [
      {skuName: skuName}
    ])).toPromise();
  }


  ///////////////////// ingredients /////////////////////
  getIngredients(andVsOr: AndVsOr, ingredientname: string, ingredientnameregex: string, ingredientnumber: number, limit: number): Promise<any> {
    return this.http.get(endpoint + "ingredients", this.generateHeaderWithFilterSchema(andVsOr, [
      {ingredientname: ingredientname},
      {ingredientname: ingredientnameregex?{$regex: ingredientnameregex}:null},
      {ingredientnumber: ingredientnumber}
    ], limit)).toPromise();
  }

  createIngredient(ingredientname: string, ingredientnumber: number,
    vendorinformation: string, unitofmeasure: string, amount: number,
    costperpackage: number, comment: string): Promise<any> {
    return this.http.put(endpoint + "ingredients", {
      ingredientname: ingredientname,
      ingredientnumber: ingredientnumber,
      vendorinformation: vendorinformation,
      unitofmeasure: unitofmeasure,
      amount: amount,
      costperpackage: costperpackage,
      comment: comment
    },
      this.generateHeaderWithFilterSchema()).toPromise();
  }

  modifyIngredient(andVsOr: AndVsOr, ingredientname: string, newingredientname: string,
    ingredientnumber: number, vendorinformation: string, unitofmeasure: string,
    amount: number, costperpackage: number, comment: string): Promise<any> {
    return this.http.post(endpoint + "ingredients", this.generateBodyWithOptions({
      ingredientname: newingredientname,
      ingredientnumber: ingredientnumber,
      vendorinformation: vendorinformation,
      unitofmeasure: unitofmeasure,
      amount: amount,
      costperpackage: costperpackage,
      comment: comment
    }),
      this.generateHeaderWithFilterSchema(andVsOr, [
        {ingredientname: ingredientname}
      ])).toPromise();
  }

  deleteIngredient(andVsOr: AndVsOr, ingredientname: string): Promise<any> {
    return this.http.delete(endpoint + "ingredients", this.generateHeaderWithFilterSchema(andVsOr, [
      {ingredientname: ingredientname}
    ])).toPromise();
  }


  ///////////////////// product lines /////////////////////
  getProductLines(andVsOr: AndVsOr, productlinename: string, productlinenameregex: string, limit: number): Promise<any> {
    return this.http.get(endpoint + "product_lines", this.generateHeaderWithFilterSchema(andVsOr, [
      {productlinename: productlinename},
      {productlinename: productlinenameregex?{$regex: productlinenameregex}:null}
    ], limit)).toPromise();
  }

  createProductLine(productlinename: string, skus: any[]): Promise<any> {
    return this.http.put(endpoint + "product_lines", {
      productlinename: productlinename,
      skus: skus
    },
      this.generateHeaderWithFilterSchema()).toPromise();
  }

  modifyProductLine(andVsOr: AndVsOr, productlinename: string, newproductlinename: string, skus: any[]): Promise<any> {
    return this.http.post(endpoint + 'product_lines', this.generateBodyWithOptions({
      productlinename: newproductlinename,
      skus: skus
    }),
      this.generateHeaderWithFilterSchema(andVsOr, [
        {productlinename: productlinename}
      ])).toPromise();
  }

  deleteProductLine(andVsOr: AndVsOr, productlinename: string): Promise<any> {
    return this.http.delete(endpoint + "product_lines", this.generateHeaderWithFilterSchema(andVsOr, [
      {productlinename: productlinename}
    ])).toPromise();
  }

  ///////////////////// Manufacturing Goals /////////////////////
  getGoals(andVsOr: AndVsOr, username: string, goalname: string, goalnameregex: string, enabled: boolean, limit: number): Promise<any> {
    return this.http.get(endpoint + "manufacturing-goals", this.generateHeaderWithFilterSchema(andVsOr, [
      {owner: username},
      {enabled: enabled},
      {goalname: goalname},
      {goalname: goalnameregex?{$regex: goalnameregex}:null}
    ], limit)).toPromise();
  }

  getUserName(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getUsers(AndVsOr.AND, auth.getUsername(), null, null, null, null, null, null, auth.getLocal(), 1).then(response => {
        setTimeout(function () {
          resolve(response[0]['_id']);;
        }, 300);
      });
    });
  }

  createGoal(goalname: string, activities: [], date: Date, enabled: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getUserName().then(id => {
        this.http.put(endpoint + 'manufacturing-goals', {
          owner: id.toString(),
          goalname: goalname,
          activities: activities,
          date: date,
          enabled: enabled
        }, this.generateHeaderWithFilterSchema()).subscribe(response => {
          resolve(response);
        });
      });
    });
  }

  modifyGoal(andVsOr: AndVsOr, goalname: string, newgoalname: string, activities: [], date: Date, enabled: boolean): Promise<any> {
    return this.http.post(endpoint + "manufacturing-goals", this.generateBodyWithOptions({
      goalname: newgoalname,
      activities: activities,
      date: date,
      enabled: enabled
    }),
      this.generateHeaderWithFilterSchema(andVsOr, [
        {goalname: goalname}
      ])).toPromise();
  }


//Need to specify owner too since goals can have the same name but different owners
  deleteGoal(andVsOr: AndVsOr, goalname: string): Promise<any> {
    return this.http.delete(endpoint + "manufacturing-goals", this.generateHeaderWithFilterSchema(andVsOr, [
      {goalname: goalname}
    ])).toPromise();
  }


  ///////////////////// Manufacturing Activities /////////////////////
  getActivities(andVsOr: AndVsOr, startdate: any, line: any, skuid: string, limit: number): Promise<any> {
    return this.http.get(endpoint + "manufacturing-activities", this.generateHeaderWithFilterSchema(andVsOr, [
      {startdate: startdate},
      {line: line},
      {sku: skuid}
    ], limit)).toPromise();
  }

  createActivity(skuid: string, numcases: number, calculatedhours: number, sethours: number, startdate: Date, line: number): Promise<any> {
    return this.http.put(endpoint + 'manufacturing-activities', {
      skuid: skuid,
      numcases: numcases,
      calculatedhours: calculatedhours,
      sethours: sethours,
      startdate: startdate,
      line: line
    }, this.generateHeaderWithFilterSchema()).toPromise();
  }

  modifyActivity(andVsOr: AndVsOr, activityId: string, newsku: string, numcases: number, calculatedhours: number, sethours: number, startdate: Date, line: string): Promise<any> {
    return this.http.post(endpoint + 'manufacturing-activities', this.generateBodyWithOptions({
      sku: newsku,
      numcases: numcases,
      calculatedhours: calculatedhours,
      sethours: sethours,
      startdate: startdate,
      line: line
    }), this.generateHeaderWithFilterSchema(andVsOr, [
      {_id: activityId},
    ])).toPromise();
  }

  deleteActivity(andVsOr: AndVsOr, activityId: string): Promise<any> {
    return this.http.delete(endpoint + "manufacturing-activities", this.generateHeaderWithFilterSchema(andVsOr, [
      {_id: activityId}
    ])).toPromise();
  }

  ///////////////////// Manufacturing Lines /////////////////////
  getLine(andVsOr: AndVsOr, linename: string, linenameregex: string, shortname: string, shortnameregex: string, limit: number): Promise<any> {
    return this.http.get(endpoint + 'manufacturing-lines', this.generateHeaderWithFilterSchema(andVsOr, [
      {linename: linename},
      {linename: linenameregex?{$regex: linenameregex}:null},
      {shortname: shortname},
      {shortname: shortnameregex?{$regex: shortnameregex}:null}
    ], limit)).toPromise();
  }

  createLine(linename: string, shortname: string, skus: [], comment: string): Promise<any> {
    return this.http.put(endpoint + 'manufacturing-lines', {
      linename: linename,
      shortname: shortname,
      skus: skus,
      comment: comment
    }).toPromise();
  }

  modifyLine(andVsOr: AndVsOr, linename: string, newlinename: string, shortname: string, skus: [], comment: string): Promise<any> {
    return this.http.post(endpoint + 'manufacturing-lines', this.generateBodyWithOptions({
      linename: newlinename,
      shortname: shortname,
      skus: skus,
      comment: comment
    }), this.generateHeaderWithFilterSchema(andVsOr, [
      {linename: linename}
    ])).toPromise();
  }

  deleteLine(andVsOr: AndVsOr, linename: string): Promise<any> {
    return this.http.delete(endpoint + 'manufacturing-lines', this.generateHeaderWithFilterSchema(andVsOr, [
      {linename: linename}
    ])).toPromise();
  }


  ///////////////////// Customers /////////////////////
  getCustomers(andVsOr: AndVsOr, customername: string, customernameregex: string, customernumber: Number, limit: number): Promise<any> {
    return this.http.get(endpoint + "customers", this.generateHeaderWithFilterSchema(andVsOr, [
      {customername: customername},
      {customername: customernameregex?{$regex: customernameregex}:null},
      {customernumber: customernumber}
    ], limit)).toPromise();
  }

  createCustomer(customername: string, customernumber: Number): Promise<any> {
    return this.http.put(endpoint + "customers", {
      customername: customername,
      customernumber: customernumber
    },
      this.generateHeaderWithFilterSchema()).toPromise();
  }

  // modifyCustomer(andVsOr: AndVsOr, customername: string, customernumber: Number, newcustomername: string, newcustomernumber: Number): Promise<any> {
  //   return this.http.post(endpoint + 'customers', this.generateBodyWithOptions({
  //     customername: newcustomername,
  //     customernumber: newcustomernumber
  //   }),
  //     this.generateHeaderWithFilterSchema(andVsOr, [
  //       {customername: customername},
  //       {customernumber: customernumber}
  //     ])).toPromise();
  // }

  // deleteCustomer(andVsOr: AndVsOr, customername: string, customernumber: Number): Promise<any> {
  //   return this.http.delete(endpoint + "customers", this.generateHeaderWithFilterSchema(andVsOr, [
  //     {customername: customername},
  //     {customernumber: customernumber}
  //   ])).toPromise();
  // }


  ///////////////////// Sales /////////////////////
  getSales(andVsOr: AndVsOr, skuid: string, customerid: string, startdate: Date, enddate: Date, limit: number): Promise<any> {
    return this.http.get(endpoint + "sales", this.generateHeaderWithFilterSchema(andVsOr, [
      {sku: skuid},
      {customer: customerid},
      {date: startdate?{$gte: startdate}:null},
      {date: enddate?{$lte: enddate}:null}
    ], limit)).toPromise();
  }

  createSale(skuid: string, customerid: string, date: Date, numcases: Number, pricepercase: Number): Promise<any> {
    return this.http.put(endpoint + "sales", {
      sku: skuid,
      customer: customerid,
      date: date,
      numcases: numcases,
      pricepercase: pricepercase
    },
      this.generateHeaderWithFilterSchema()).toPromise();
  }

  // modifySale(andVsOr: AndVsOr, skuid: string, customerid: string, startdate: Date, enddate: Date, newskuid: string, newcustomerid: string, newdate: Date, newnumcases: Number, newpricepercase: Number): Promise<any> {
  //   return this.http.post(endpoint + 'sales', this.generateBodyWithOptions({
  //     sku: newskuid,
  //     customer: newcustomerid,
  //     date: newdate,
  //     numcases: newnumcases,
  //     pricepercase: newpricepercase
  //   }),
  //     this.generateHeaderWithFilterSchema(andVsOr, [
  //       {sku: skuid},
  //       {customer: customerid},
  //       {date: startdate?{$gte: startdate}:null},
  //       {date: enddate?{$lte: enddate}:null}
  //     ])).toPromise();
  // }

  // deleteSale(andVsOr: AndVsOr, skuid: string, customerid: string, startdate: Date, enddate: Date): Promise<any> {
  //   return this.http.delete(endpoint + "sales", this.generateHeaderWithFilterSchema(andVsOr, [
  //     {sku: skuid},
  //     {customer: customerid},
  //     {date: startdate?{$gte: startdate}:null},
  //     {date: enddate?{$lte: enddate}:null}
  //   ])).toPromise();
  // }


  ///////////////////// Login /////////////////////

  serverLocation: string = endpoint.substring(endpoint.indexOf("//") + 2, endpoint.indexOf(":", endpoint.indexOf("//")));

  getClientID(): string {
    if (this.serverLocation == 'vcm-8238.vm.duke.edu') { // Ben
      return 'benserver';
    } else if (this.serverLocation == 'vcm-8405.vm.duke.edu') { // Noah
      return 'noahserver';
    } else if (this.serverLocation == 'vcm-8205.vm.duke.edu') { // Prod
      return 'prodserver';
    } else { // localhost
      return 'localhost';
    }
  }

  getClientSecret(): string {
    if (this.serverLocation == 'vcm-8238.vm.duke.edu') { // Ben
      return 'HQIaVbToUN84U1@kwTy6!t%8=AQimYUBPhtoMI2!iTx9pP43fC';
    } else if (this.serverLocation == 'vcm-8405.vm.duke.edu') { // Noah
      return '$w8J3iMdA!o16ktD@ijjHgnua#P!KQt#+ZXRJ5et%95gKgP!WE';
    } else if (this.serverLocation == 'vcm-8205.vm.duke.edu') { // Prod
      return 'Qtc8mg5pZSeeTtg#WP4gR=h9g+gxFkYzf**4l2XjHHpDmGhK#s';
    } else { // localhost
      return '4sqNKIcu%*H7$9=QPKG3Qx=n=9I3zqmnDwZ14MaaFYS3Wx86*p';
    }
  }

  // loginRequest(username, password): Promise<any> {
  //   return this.http.get(endpoint + 'login', {
  //     headers: new HttpHeaders({
  //       username: username,
  //       password: password
  //     })
  //   }).toPromise();
  // }

  // loginRequestNetID(netidtoken): Promise<any> {
  //   return this.http.get(endpoint + 'login', {
  //     headers: new HttpHeaders({
  //       netidtoken: netidtoken,
  //       clientid: this.getClientID()
  //     })
  //   }).toPromise();
  // }

}
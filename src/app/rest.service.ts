import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { auth } from './auth.service';

// const endpoint = 'https://vcm-8238.vm.duke.edu:8443/'; // Ben
// const endpoint = 'https://vcm-8405.vm.duke.edu:8443/'; // Noah
// const endpoint = 'https://vcm-8205.vm.duke.edu:8443/'; // Prod
const endpoint = 'https://localhost:8443/'; // localhost

export enum AndVsOr {
  AND = '$and',
  OR = '$or'
}

@Injectable({
  providedIn: 'root'
})
export class RestService {

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
    headersOptions['andorclause'] = JSON.stringify(headersOptions['andorclause']);
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
  getUsers(andVsOr: AndVsOr, username: string, usernameregex: string, admin: boolean, localuser: boolean, limit: number): Promise<any> {
    var header = this.generateHeaderWithFilterSchema(andVsOr, [
      { username: username },
      { username: usernameregex?{ $regex: usernameregex }:null },
      { admin: admin },
      { localuser: localuser }
    ], limit);
    console.log(header);
    return this.http.get(endpoint + 'users', header).toPromise();
  }

  createUser(username: string, password: string, admin: boolean): Promise<any> {
    return this.http.put(endpoint + 'users', {
      username: username,
      password: password,
      admin: admin,
      localuser: true
    },
      this.generateHeaderWithFilterSchema()).toPromise();
  }

  modifyUser(andVsOr: AndVsOr, username: string, localuser: boolean, newpassword: string, newadmin: boolean): Promise<any> {
    return this.http.post(endpoint + 'users', this.generateBodyWithOptions({
      password: newpassword,
      admin: newadmin == newadmin
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
  getFormulas(andVsOr: AndVsOr, formulaname: string, formulanameregex: string, formulanumber: number, ingredientid: number, skuid: number, limit: number): Promise<any> {
    return this.http.get(endpoint + "formulas", this.generateHeaderWithFilterSchema(andVsOr, {
      formulaname: formulaname,
      formulanameregex: formulanameregex,
      formulanumber: formulanumber,
      ingredientid: ingredientid,
      skuid: skuid
    }, limit)).toPromise();
  }

  createFormula(andVsOr: AndVsOr, formulaname: String, formulanumber: Number, ingredientsandquantities: any[], comment: String): Promise<any> {
    return this.http.put(endpoint + "formulas", {
      formulaname: formulaname,
      formulanumber: formulanumber,
      ingredientsandquantities: ingredientsandquantities,
      comment: comment
    },
      this.generateHeaderWithFilterSchema()).toPromise();
  }

  modifyFormula(andVsOr: AndVsOr, oldname: string, formulaname: string, formulanumber: number, ingredientsandquantities: any[], comment: string): Promise<any> {
    return this.http.post(endpoint + "formulas", {
      formulaname: formulaname,
      formulanumber: formulanumber,
      ingredientsandquantities: ingredientsandquantities,
      comment: comment
    },
      this.generateHeaderWithFilterSchema(andVsOr, {
        formulaname: oldname
      })).toPromise();
  }

  deleteFormula(andVsOr: AndVsOr, formulanumber: number): Promise<any> {
    return this.http.delete(endpoint + "formulas", this.generateHeaderWithFilterSchema(andVsOr, {
      formulanumber: formulanumber
    })).toPromise();
  }

  ///////////////////// skus /////////////////////
  getSkus(andVsOr: AndVsOr, skuName: String, skunameregex: String, skuNumber: number, caseUpcNumber: number, unitUpcNumber: number, formula: String, limit: number): Promise<any> {

    return this.http.get(endpoint + "skus", this.generateHeaderWithFilterSchema(andVsOr, {
      skuname: skuName,
      skunameregex: skunameregex,
      skunumber: skuNumber,
      caseupcnumber: caseUpcNumber,
      unitupcnumber: unitUpcNumber,
      formula: formula
    }, limit)).toPromise();
  }

  createSku(skuname: String, skunumber: number,
    caseupcnumber: number, unitupcnumber: number, unitsize: string,
    countpercase: number, formulanum: Number, formulascalingfactor: Number, manufacturingrate: Number, comment: String): Promise<any> {
    return this.http.put(endpoint + "skus", {
      skuname: skuname,
      skunumber: skunumber,
      caseupcnumber: caseupcnumber,
      unitupcnumber: unitupcnumber,
      unitsize: unitsize,
      countpercase: countpercase,
      formulanum: formulanum,
      formulascalingfactor: formulascalingfactor,
      manufacturingrate: manufacturingrate,
      comment: comment
    },
      this.generateHeaderWithFilterSchema()).toPromise();
  }

  modifySku(andVsOr: AndVsOr, oldSkuName: String, skuname: String, skunumber: number,
    caseupcnumber: number, unitupcnumber: number, unitsize: string,
    countpercase: number, formulanum: Number, formulascalingfactor: Number, manufacturingrate: Number, comment: String): Promise<any> {
    return this.http.post(endpoint + "skus", {
      skuname: skuname,
      skunumber: skunumber,
      caseupcnumber: caseupcnumber,
      unitupcnumber: unitupcnumber,
      unitsize: unitsize,
      countpercase: countpercase,
      formulanum: formulanum,
      formulascalingfactor: formulascalingfactor,
      manufacturingrate: manufacturingrate,
      comment: comment
    },
      this.generateHeaderWithFilterSchema(andVsOr, {
        skuname: oldSkuName
      })).toPromise();
  }

  deleteSku(andVsOr: AndVsOr, skuName: String): Promise<any> {
    return this.http.delete(endpoint + "skus", this.generateHeaderWithFilterSchema(andVsOr, {
      skuName: skuName
    })).toPromise();
  }


  ///////////////////// ingredients /////////////////////
  getIngredients(andVsOr: AndVsOr, ingredientname: String, ingredientnameregex: String, ingredientnumber: number, limit: number): Promise<any> {
    return this.http.get(endpoint + "ingredients", this.generateHeaderWithFilterSchema(andVsOr, {
      ingredientname: ingredientname,
      ingredientnameregex: ingredientnameregex,
      ingredientnumber: ingredientnumber
    }, limit)).toPromise();
  }

  createIngredient(ingredientname: String, ingredientnumber: number,
    vendorinformation: String, unitofmeasure: String, amount: number,
    costperpackage: number, comment: String): Promise<any> {
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

  modifyIngredient(andVsOr: AndVsOr, ingredientname: String, newingredientname: String,
    ingredientnumber: number, vendorinformation: String, unitofmeasure: String,
    amount: number, costperpackage: number, comment: String): Promise<any> {
    return this.http.post(endpoint + "ingredients", {
      ingredientname: newingredientname,
      ingredientnumber: ingredientnumber,
      vendorinformation: vendorinformation,
      unitofmeasure: unitofmeasure,
      amount: amount,
      costperpackage: costperpackage,
      comment: comment
    },
      this.generateHeaderWithFilterSchema(andVsOr, {
        ingredientname: ingredientname
      })).toPromise();
  }

  deleteIngredient(andVsOr: AndVsOr, ingredientname: String): Promise<any> {
    return this.http.delete(endpoint + "ingredients", this.generateHeaderWithFilterSchema(andVsOr, {
      ingredientname: ingredientname
    })).toPromise();
  }


  ///////////////////// product lines /////////////////////
  getProductLines(andVsOr: AndVsOr, productlinename: String, productlinenameregex: String, limit: number): Promise<any> {
    return this.http.get(endpoint + "product_lines", this.generateHeaderWithFilterSchema(andVsOr, {
      productlinename: productlinename,
      productlinenameregex: productlinenameregex
    }, limit)).toPromise();
  }

  createProductLine(productlinename: String, skus: any[]): Promise<any> {
    return this.http.put(endpoint + "product_lines", {
      productlinename: productlinename,
      skus: skus
    },
      this.generateHeaderWithFilterSchema()).toPromise();
  }

  modifyProductLine(andVsOr: AndVsOr, productlinename: String, newproductlinename: String, skus: any[]): Promise<any> {
    return this.http.post(endpoint + 'product_lines', {
      productlinename: newproductlinename,
      skus: skus
    },
      this.generateHeaderWithFilterSchema(andVsOr, {
        productlinename: productlinename
      })).toPromise();
  }

  deleteProductLine(andVsOr: AndVsOr, productlinename: String): Promise<any> {
    return this.http.delete(endpoint + "product_lines", this.generateHeaderWithFilterSchema(andVsOr, {
      productlinename: productlinename
    })).toPromise();
  }

  ///////////////////// Manufacturing Goals /////////////////////
  getGoals(andVsOr: AndVsOr, username: String, goalname: String, goalnameregex: String, enabled: boolean, limit: number): Promise<any> {
    return this.http.get(endpoint + "manufacturing-goals", this.generateHeaderWithFilterSchema(andVsOr, {
      owner: username,
      enabled: enabled,
      goalname: goalname,
      goalnameregex: goalnameregex
    }, limit)).toPromise();
  }

  getUserName(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getUsers(AndVsOr.AND, auth.getUsername(), null, null, null, null).then(response => {
        setTimeout(function () {
          resolve(response[0]['_id']);;
        }, 300);
      });
    });
  }

  createGoal(goalname: String, activities: [], date: Date, enabled: boolean): Promise<any> {
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

  modifyGoal(andVsOr: AndVsOr, goalname: String, newgoalname: String, activities: [], date: Date, enabled: boolean): Promise<any> {
    return this.http.post(endpoint + "manufacturing-goals", {
      goalname: newgoalname,
      activities: activities,
      date: date,
      enabled: enabled
    },
      this.generateHeaderWithFilterSchema(andVsOr, {
        goalname: goalname
      })).toPromise();
  }



  deleteGoal(andVsOr: AndVsOr, goalname: String): Promise<any> {
    return this.http.delete(endpoint + "manufacturing-goals", this.generateHeaderWithFilterSchema(andVsOr, {
      goalname: goalname
    })).toPromise();
  }


  ///////////////////// Manufacturing Activities /////////////////////
  getActivities(andVsOr: AndVsOr, startdate: Date, line: string, limit: number): Promise<any> {
    return this.http.get(endpoint + "manufacturing-activities", this.generateHeaderWithFilterSchema(andVsOr, {
      startdate: startdate,
      line: line
    }, limit)).toPromise();
  }

  createActivity(skuid: number, numcases: number, calculatedhours: number, sethours: number, startdate: Date, line: number): Promise<any> {
    return this.http.put(endpoint + 'manufacturing-activities', {
      skuid: skuid,
      numcases: numcases,
      calculatedhours: calculatedhours,
      sethours: sethours,
      startdate: startdate,
      line: line
    }, this.generateHeaderWithFilterSchema()).toPromise();
  }

  modifyActivity(andVsOr: AndVsOr, sku: string, newsku: string, numcases: number, calculatedhours: number, sethours: number, startdate: Date, line: string): Promise<any> {
    return this.http.post(endpoint + 'manufacturing-activities', {
      sku: newsku,
      numcases: numcases,
      calculatedhours: calculatedhours,
      sethours: sethours,
      startdate: startdate,
      line: line
    }, this.generateHeaderWithFilterSchema(andVsOr, {
      sku: sku,
      numcases: numcases,
      calculatedhours: calculatedhours,
      startdate: startdate
    })).toPromise();
  }

  deleteActivity(andVsOr: AndVsOr, activityId: string): Promise<any> {
    return this.http.delete(endpoint + "manufacturing-activities", this.generateHeaderWithFilterSchema(andVsOr, {
      _id: activityId
    })).toPromise();
  }

  ///////////////////// Manufacturing Lines /////////////////////
  getLine(andVsOr: AndVsOr, linename: String, linenameregex: String, shortname: String, shortnameregex: String, limit: number): Promise<any> {
    return this.http.get(endpoint + 'manufacturing-lines', this.generateHeaderWithFilterSchema(andVsOr, {
      linename: linename,
      linenameregex: linenameregex,
      shortname: shortname,
      shortnameregex: shortnameregex
    }, limit)).toPromise();
  }

  createLine(linename: String, shortname: String, skus: [], comment: String): Promise<any> {
    return this.http.put(endpoint + 'manufacturing-lines', {
      linename: linename,
      shortname: shortname,
      skus: skus,
      comment: comment
    }).toPromise();
  }

  modifyLine(andVsOr: AndVsOr, linename: String, newlinename: String, shortname: String, skus: [], comment: String): Promise<any> {
    return this.http.post(endpoint + 'manufacturing-lines', {
      linename: newlinename,
      shortname: shortname,
      skus: skus,
      comment: comment
    }, this.generateHeaderWithFilterSchema(andVsOr, {
      linename: linename
    })).toPromise();
  }

  deleteLine(andVsOr: AndVsOr, linename: String): Promise<any> {
    return this.http.delete(endpoint + 'manufacturing-lines', this.generateHeaderWithFilterSchema(andVsOr, {
      linename: linename
    })).toPromise();
  }

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

  loginRequest(username, password): Promise<any> {
    return this.http.get(endpoint + 'login', {
      headers: new HttpHeaders({
        username: username,
        password: password
      })
    }).toPromise();
  }

  loginRequestNetID(netidtoken): Promise<any> {
    return this.http.get(endpoint + 'login', {
      headers: new HttpHeaders({
        netidtoken: netidtoken,
        clientid: this.getClientID()
      })
    }).toPromise();
  }

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { auth } from './auth.service'
import { start } from 'repl';

// const endpoint = 'https://vcm-8238.vm.duke.edu:8443/'; // Ben
// const endpoint = 'https://vcm-8405.vm.duke.edu:8443/'; // Noah
// const endpoint = 'https://vcm-8205.vm.duke.edu:8443/'; // Prod
const endpoint = 'https://localhost:8443/'; // localhost

export enum AndVsOr {
  AND= '$and',
  OR= '$or'
}

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  serverLocation: string = endpoint.substring(endpoint.indexOf("//")+2, endpoint.indexOf(":", endpoint.indexOf("//")));

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

  private generateHeader(andVsOr?: AndVsOr, options?: any) {
    if (options && !(andVsOr == AndVsOr.AND || andVsOr == AndVsOr.OR)) {
      throw Error("If you are passing non-null options to the rest call you must pass a non-null value specifying AND vs OR.");
    }

    options = options || {};
    options['Content-Type'] = 'application/json';
    options['token'] = auth.getToken();
    let header:HttpHeaders = new HttpHeaders(options);
    
    var headers = {
      andvsor: andVsOr
    };
    for (let key of Object.keys(options)) {
      if (options[key]) {
        headers[key.toLowerCase()] = JSON.stringify(options[key]);
      }
    }

    let httpOptions = {
      headers: headers
    }
    return httpOptions
  }

  loginRequest(username, password, netidtoken?): Promise<any> {
    if (netidtoken) {
      return this.http.get(endpoint + 'login', {
        headers: new HttpHeaders({
          netidtoken: netidtoken,
          clientid: this.getClientID()
        })
      }).toPromise();
    } else {
      return this.http.get(endpoint + 'login', {
        headers: new HttpHeaders({
          username: username,
          password: password
        })
      }).toPromise();
    }
  }

  ///////////////////// users /////////////////////
  getUsers(andVsOr: AndVsOr, username: string, usernameregex: string, admin: boolean, localuser: boolean, limit: number): Promise<any> {
    return this.http.get(endpoint + 'users', this.generateHeader(andVsOr, {
      username: username,
      usernameregex: usernameregex,
      admin: admin,
      localuser: localuser,
      limit: limit
    })).toPromise();
  }

  createUser(username: string, password: string, admin: boolean): Promise<any> {
    return this.http.put(endpoint + 'users', {
      username: username,
      password: password,
      admin: admin,
      localuser: true
    },
      this.generateHeader()).toPromise();
  }

  modifyUser(andVsOr: AndVsOr, username: string, localuser: boolean, newpassword: string, newadmin: boolean): Promise<any> {
    return this.http.post(endpoint + 'users', {
      password: newpassword||"",
      admin: newadmin==null?"":newadmin
    },
      this.generateHeader(andVsOr, {
        username: username,
        localuser: localuser
      })).toPromise();
  }

  deleteUser(andVsOr: AndVsOr, username: string, localuser: boolean): Promise<any> {
    return this.http.delete(endpoint + 'users', this.generateHeader(andVsOr, {
      username: username,
      localuser: localuser
    })).toPromise();
  }

///////////////////// formulas /////////////////////
getFormulas(andVsOr: AndVsOr, formulaname: string, formulanameregex: string, formulanumber: number, ingredientid: number, skuid: number, limit: number): Promise<any> {
  return this.http.get(endpoint + "formulas", this.generateHeader(andVsOr, {
    formulaname: formulaname,
    formulanameregex: formulanameregex,
    formulanumber: formulanumber,
    ingredientid: ingredientid,
    skuid: skuid,
    limit: limit
  })).toPromise();
}

createFormula(andVsOr: AndVsOr, formulaname: String, formulanumber: Number, ingredientsandquantities: any[], comment: String): Promise<any> {
  return this.http.put(endpoint + "formulas", {
    formulaname: formulaname,
    formulanumber: formulanumber,
    ingredientsandquantities: ingredientsandquantities,
    comment: comment
  },
  this.generateHeader()).toPromise();
}

modifyFormula(andVsOr: AndVsOr, oldname: string, formulaname: string, formulanumber: number, ingredientsandquantities: any[], comment: string): Promise<any> {
  return this.http.post(endpoint + "formulas", {
    formulaname: formulaname,
    formulanumber: formulanumber,
    ingredientsandquantities: ingredientsandquantities,
    comment: comment
  },
  this.generateHeader(andVsOr, {
    formulaname: oldname
  })).toPromise();
}

deleteFormula(andVsOr: AndVsOr, formulanumber: number): Promise<any> {
  return this.http.delete(endpoint + "formulas", this.generateHeader(andVsOr, {
    formulanumber: formulanumber
  })).toPromise();
}

 ///////////////////// skus /////////////////////
 getSkus(andVsOr: AndVsOr, skuName: String, skunameregex: String, skuNumber: number, caseUpcNumber: number, unitUpcNumber: number, formula: String, limit: number): Promise<any> {

  return this.http.get(endpoint + "skus", this.generateHeader(andVsOr, {
    skuname: skuName,
    skunameregex: skunameregex,
    skunumber: skuNumber,
    caseupcnumber: caseUpcNumber,
    unitupcnumber: unitUpcNumber,
    formula: formula,
    limit: limit
  })).toPromise();
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
  this.generateHeader()).toPromise();
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
  this.generateHeader(andVsOr, {
    skuname: oldSkuName
  })).toPromise();
}

deleteSku(andVsOr: AndVsOr, skuName: String): Promise<any> {
  return this.http.delete(endpoint + "skus", this.generateHeader(andVsOr, {
    skuName: skuName
  })).toPromise();
}


  ///////////////////// ingredients /////////////////////
  getIngredients(andVsOr: AndVsOr, ingredientname: String, ingredientnameregex: String, ingredientnumber: number, limit: number): Promise<any> {
    return this.http.get(endpoint + "ingredients", this.generateHeader(andVsOr, {
      ingredientname: ingredientname,
      ingredientnameregex: ingredientnameregex,
      ingredientnumber: ingredientnumber,
      limit: limit
    })).toPromise();
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
  this.generateHeader()).toPromise();
}

modifyIngredient(andVsOr: AndVsOr, ingredientname: String,  newingredientname: String, 
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
  this.generateHeader(andVsOr, {
    ingredientname: ingredientname
  })).toPromise();
}

deleteIngredient(andVsOr: AndVsOr, ingredientname: String): Promise<any> {
  return this.http.delete(endpoint + "ingredients", this.generateHeader(andVsOr, {
    ingredientname: ingredientname
  })).toPromise();
}


  ///////////////////// product lines /////////////////////
  getProductLines(andVsOr: AndVsOr, productlinename: String, productlinenameregex: String, limit: number): Promise<any> {
    return this.http.get(endpoint + "product_lines", this.generateHeader(andVsOr, {
      productlinename: productlinename,
      productlinenameregex: productlinenameregex,
      limit: limit
    })).toPromise();
  }

  createProductLine(productlinename: String, skus: any[]): Promise<any> {
    return this.http.put(endpoint + "product_lines", {
      productlinename: productlinename,
      skus: skus
    },
    this.generateHeader()).toPromise();
  }

  modifyProductLine(andVsOr: AndVsOr, productlinename: String,  newproductlinename: String, skus: any[]): Promise<any> {
    return this.http.post(endpoint + 'product_lines', {
      productlinename: newproductlinename,
      skus: skus
    },
      this.generateHeader(andVsOr, {
        productlinename: productlinename
      })).toPromise();
  }

  deleteProductLine(andVsOr: AndVsOr, productlinename: String): Promise<any> {
    return this.http.delete(endpoint + "product_lines", this.generateHeader(andVsOr, {
      productlinename: productlinename
    })).toPromise();
  }

  ///////////////////// Manufacturing Goals /////////////////////
  getGoals(andVsOr: AndVsOr, username: String,  goalname: String, goalnameregex: String, enabled: boolean, limit: number): Promise<any> {
    return this.http.get(endpoint + "manufacturing-goals", this.generateHeader(andVsOr, {
      owner: username,
      enabled: enabled,
      goalname: goalname,
      goalnameregex: goalnameregex,
      limit: limit
    })).toPromise();
  }

  getUserName(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getUsers(AndVsOr.AND, auth.getUsername(), null, null, null, null).then(response =>{
        setTimeout(function() {
          resolve(response[0]['_id']);;
        }, 300);
    });
  });
  }

  createGoal(goalname: String, activities: [], date: Date, enabled: boolean) : Promise<any>{
    return new Promise((resolve, reject) => {
      this.getUserName().then(id => {
        this.http.put(endpoint + 'manufacturing-goals',{
          owner: id.toString(),
          goalname: goalname,
          activities: activities,
          date: date,
          enabled: enabled
        }, this.generateHeader()).subscribe(response => {
          resolve(response);
        });
      });
    });
  }

  modifyGoal(andVsOr: AndVsOr, goalname: String, newgoalname: String, activities: [], date:Date, enabled: boolean): Promise<any> {
    return this.http.post(endpoint + "manufacturing-goals", {
      goalname: newgoalname,
      activities: activities,
      date: date,
      enabled: enabled
    },
    this.generateHeader(andVsOr, {
      goalname: goalname
    })).toPromise();
  }



deleteGoal(andVsOr: AndVsOr, goalname: String): Promise<any> {
  return this.http.delete(endpoint + "manufacturing-goals", this.generateHeader(andVsOr, {
    goalname: goalname
  })).toPromise();
}


  ///////////////////// Manufacturing Activities /////////////////////
  getActivities(andVsOr: AndVsOr, startdate: Date, line: string, limit: number): Promise<any> {
    return this.http.get(endpoint + "manufacturing-activities", this.generateHeader(andVsOr, {
      startdate: startdate,
      line: line,
      limit: limit
    })).toPromise();
  }

  createActivity(sku: number, numcases: number, calculatedhours: number, sethours: number, startdate: Date, line: number) : Promise<any>{
    return this.http.put(endpoint + 'manufacturing-activities',{
      sku: sku,
      numcases: numcases,
      calculatedhours: calculatedhours,
      sethours: sethours,
      startdate: startdate,
      line: line
    }, this.generateHeader()).toPromise();
  }

  modifyActivity(andVsOr: AndVsOr, sku: string, newsku: string, numcases: number, calculatedhours: number, sethours: number, startdate: Date, line: string): Promise<any> {
    return this.http.post(endpoint + 'manufacturing-activities',{
      sku: newsku,
      numcases: numcases,
      calculatedhours: calculatedhours,
      sethours: sethours,
      startdate: startdate,
      line: line
    }, this.generateHeader(andVsOr, {
      sku: sku,
      numcases: numcases,
      calculatedhours: calculatedhours,
      startdate: startdate
    })).toPromise();
  }

  deleteActivity(andVsOr: AndVsOr, activityId: string): Promise<any> {
    return this.http.delete(endpoint + "manufacturing-activities", this.generateHeader(andVsOr, {
      _id: activityId
    })).toPromise();
  }

  ///////////////////// Manufacturing Lines /////////////////////
  getLine(andVsOr: AndVsOr, linename: String, linenameregex: String, shortname: String, shortnameregex: String, limit: number): Promise<any> {
    return this.http.get(endpoint + 'manufacturing-lines', this.generateHeader(andVsOr, {
      linename: linename,
      linenameregex: linenameregex,
      shortname: shortname,
      shortnameregex: shortnameregex,
      limit: limit
    })).toPromise();
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
    }, this.generateHeader(andVsOr, {
      linename: linename
    })).toPromise();
  }

  deleteLine(andVsOr: AndVsOr, linename: String): Promise<any> {
    return this.http.delete(endpoint + 'manufacturing-lines', this.generateHeader(andVsOr, {
      linename: linename
    })).toPromise();
  }

}
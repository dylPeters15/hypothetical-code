import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { auth } from './auth.service'
import { Observable } from 'rxjs';
import { start } from 'repl';

// const endpoint = 'https://vcm-8238.vm.duke.edu:8443/'; // Ben
// const endpoint = 'https://vcm-8405.vm.duke.edu:8443/'; // Noah
// const endpoint = 'https://vcm-8205.vm.duke.edu:8443/'; // Prod
const endpoint = 'https://localhost:8443/'; // localhost

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

  private generateHeader(options?) {
    options = options || {};
    options['Content-Type'] = 'application/json';
    options['token'] = auth.getToken();
    let header:HttpHeaders = new HttpHeaders(options)
    let httpOptions = {
      headers: header
    }
    return httpOptions
  }

  loginRequest(username, password, netidtoken?): Observable<any> {
    if (netidtoken) {

      return this.http.get(endpoint + 'login', {
        headers: new HttpHeaders({
          netidtoken: netidtoken,
          clientid: this.getClientID()
        })
      });
    } else {
      return this.http.get(endpoint + 'login', {
        headers: new HttpHeaders({
          username: username,
          password: password
        })
      });
    }
  }

  ///////////////////// users /////////////////////
  getUsers(username: string, usernameregex: string, admin: boolean, localuser: boolean, limit: number): Observable<any> {
    return this.http.get(endpoint + 'users', this.generateHeader({
      username: username,
      usernameregex: usernameregex,
      admin: admin==null?"":""+admin,
      localuser: localuser==null?"":""+localuser,
      limit: ""+limit
    }));
  }

  createUser(username: string, password: string, admin: boolean): Observable<any> {
    return this.http.put(endpoint + 'users', {
      username: username,
      password: password,
      admin: admin,
      localuser: true
    },
      this.generateHeader());
  }

  modifyUser(username: string, localuser: boolean, newpassword: string, newadmin: boolean): Observable<any> {
    return this.http.post(endpoint + 'users', {
      password: newpassword||"",
      admin: newadmin==null?"":newadmin
    },
      this.generateHeader({
        username: username,
        localuser: ""+localuser
      }));
  }

  deleteUser(username: string, localuser: boolean): Observable<any> {
    return this.http.delete(endpoint + 'users', this.generateHeader({
      username: username,
      localuser: ""+localuser
    }));
  }

///////////////////// formulas /////////////////////
getFormulas(formulaname: string, formulanumber: number, ingredient: number, limit: number, formulanameregex?: string, sku?: number): Observable<any> {
  console.log("limit", limit);
  console.log("formulaname",formulaname);
  console.log("formulanumber",formulanumber);
  console.log("ingredient",ingredient);
  console.log("limit",limit);
  console.log("formulanameregex",formulanameregex);
  console.log("sku",sku);

  var header = {
    formulaname: formulaname||"",
    formulanameregex: formulanameregex||"$a",
    formulanumber: JSON.stringify(formulanumber||0),
    sku: JSON.stringify(sku||0),
    ingredient: ""+(ingredient||0),
    limit: JSON.stringify(limit||20)
  };

  console.log("Header: ",header);

  return this.http.get(endpoint + "formulas", this.generateHeader(header));
}

createFormula(formulaname: String, formulanumber: Number, ingredientsandquantities: any[], comment: String): Observable<any> {
  console.log("in the rest api!");
  return this.http.put(endpoint + "formulas", {
    formulaname: formulaname,
    formulanumber: formulanumber,
    ingredientsandquantities: ingredientsandquantities,
    comment: comment
  },
  this.generateHeader());
}

modifyFormula(oldname: string, formulaname: string, formulanumber: number, ingredientsandquantities: any[], comment: string): Observable<any> {
  return this.http.post(endpoint + "formulas", {
    formulaname: formulaname,
    formulanumber: formulanumber,
    ingredientsandquantities: ingredientsandquantities,
    comment: comment||""
  },
  this.generateHeader({
    formulaname: oldname
  }));
}

deleteFormula(sku: number, ingredient: number): Observable<any> {
  return this.http.delete(endpoint + "formulas", this.generateHeader({
    sku: sku,
    ingredient: ingredient
  }));
}

 ///////////////////// skus /////////////////////
 getSkus(skuName: String, skunameregex: String, skuNumber: number, caseUpcNumber: number, unitUpcNumber: number, formula: String, limit: number): Observable<any> {
   console.log("formula number rest", formula)
  return this.http.get(endpoint + "skus", this.generateHeader({
    skuname: skuName,
    skunameregex: skunameregex,
    skunumber: JSON.stringify(skuNumber),
    caseupcnumber: JSON.stringify(caseUpcNumber),
    unitupcnumber: JSON.stringify(unitUpcNumber),
    formula: formula,
    limit: JSON.stringify(limit)
  }));
}

createSku(skuname: String, skunumber: number, 
  caseupcnumber: number, unitupcnumber: number, unitsize: string, 
  countpercase: number, formulanum: Number, formulascalingfactor: Number, manufacturingrate: Number, comment: String): Observable<any> {
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
  this.generateHeader());
}

modifySku(oldSkuName: String, skuname: String, skunumber: number, 
  caseupcnumber: number, unitupcnumber: number, unitsize: string, 
  countpercase: number, formulanum: Number, formulascalingfactor: Number, manufacturingrate: Number, comment: String): Observable<any> {
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
  this.generateHeader({
    skuname: oldSkuName
  }));
}

deleteSku(skuName: String): Observable<any> {
  return this.http.delete(endpoint + "skus", this.generateHeader({
    skuName: skuName,
  }));
}


  ///////////////////// ingredients /////////////////////
  getIngredients(ingredientname: String, ingredientnameregex: String, ingredientnumber: number, limit: number): Observable<any> {
    return this.http.get(endpoint + "ingredients", this.generateHeader({
      ingredientname: ingredientname,
      ingredientnameregex: ingredientnameregex,
      ingredientnumber: JSON.stringify(ingredientnumber),
      limit: limit
    }));
  }

createIngredient(ingredientname: String, ingredientnumber: number, 
  vendorinformation: String, unitofmeasure: String, amount: number, 
  costperpackage: number, comment: String): Observable<any> {
  return this.http.put(endpoint + "ingredients", {
    ingredientname: ingredientname,
    ingredientnumber: ingredientnumber,
    vendorinformation: vendorinformation,
    unitofmeasure: unitofmeasure,
    amount: amount,
    costperpackage: costperpackage,
    comment: comment
  },
  this.generateHeader());
}

modifyIngredient(ingredientname: String,  newingredientname: String, 
  ingredientnumber: number, vendorinformation: String, unitofmeasure: String, 
  amount: number, costperpackage: number, comment: String): Observable<any> {
  return this.http.post(endpoint + "ingredients", {
    $set: {
      ingredientname: newingredientname,
      ingredientnumber: ingredientnumber,
      vendorinformation: vendorinformation,
      unitofmeasure: unitofmeasure,
      amount: amount,
      costperpackage: costperpackage,
      comment: comment||""
    }
  },
  this.generateHeader({
    ingredientname: ingredientname
  }));
}

deleteIngredient(ingredientname: String): Observable<any> {
  return this.http.delete(endpoint + "ingredients", this.generateHeader({
    ingredientname: ingredientname,
  }));
}


  ///////////////////// product lines /////////////////////
  getProductLines(productlinename: String, productlinenameregex: String, limit: number): Observable<any> {
    return this.http.get(endpoint + "product_lines", this.generateHeader({
      productlinename: productlinename,
      productlinenameregex: productlinenameregex,
      limit: JSON.stringify(limit)
    }));
  }

  createProductLine(productlinename: String, skus: any[]): Observable<any> {
    return this.http.put(endpoint + "product_lines", {
      productlinename: productlinename,
      skus: skus
    },
    this.generateHeader());
  }

  modifyProductLine(productlinename: String,  newproductlinename: String, skus: any[], ): Observable<any> {
    return this.http.post(endpoint + 'product_lines', {
      productlinename: newproductlinename||"",
      skus: skus||[]
    },
      this.generateHeader({
        productlinename: productlinename
      }));
  }

  deleteProductLine(productlinename: String): Observable<any> {
    return this.http.delete(endpoint + "product_lines", this.generateHeader({
      productlinename: productlinename
    }));
  }

  ///////////////////// Manufacturing Goals /////////////////////
  getGoals(username: String,  goalname: String, goalnameregex: String, enabled: boolean, limit: number): Observable<any> {
    return this.http.get(endpoint + "manufacturing-goals", this.generateHeader({
      owner: username,
      enabled: JSON.stringify(enabled),
      goalname: goalname,
      goalnameregex: goalnameregex,
      limit: limit
    }));
  }

  getUserName(){
    return new Promise((resolve, reject) => {
      this.getUsers(auth.getUsername(), "",null, null, null).subscribe(response =>{
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

  modifyGoal(goalname: String, newgoalname: String, activities: [], date:Date, enabled: boolean): Observable<any> {
    return this.http.post(endpoint + "manufacturing-goals", {
      goalname: newgoalname,
      activities: activities,
      date: date,
      enabled: enabled
    },
    this.generateHeader({
      goalname: goalname
    }));
  }



deleteGoal(goalname: String): Observable<any> {
  return this.http.delete(endpoint + "manufacturing-goals", this.generateHeader({
    goalname: goalname
  }));
}


  ///////////////////// Manufacturing Activities /////////////////////
  getActivities(startdate: Date, limit: number, line?: string): Observable<any> {
    return this.http.get(endpoint + "manufacturing-activities", this.generateHeader({
      startdate: JSON.stringify(startdate),
      limit: limit, 
      line: line
    }));
  }

  createActivity(sku: number, numcases: number, calculatedhours: number, sethours: number, startdate: Date, line: number) : Observable<any>{
    return this.http.put(endpoint + 'manufacturing-activities',{
      sku: sku,
      numcases: numcases,
      calculatedhours: calculatedhours,
      sethours: sethours,
      startdate: startdate,
      line: line
    }, this.generateHeader());
  }

  deleteActivity(sku: number, numcases: number, calculatedhours: number, sethours: number, startdate: Date, line: number){
    return this.http.delete(endpoint + "manufacturing-activities", this.generateHeader({
      sku: sku,
      numcases: numcases,
      calculatedhours: calculatedhours,
      sethours: sethours,
      startdate: startdate,
      line: line
    }));
  }

  modifyActivity(sku: string, newsku: string, numcases: number, calculatedhours: number, sethours: number, startdate: Date, line: number){
    console.log("rest set", sethours)
    return this.http.post(endpoint + 'manufacturing-activities',{
      sku: newsku,
      numcases: numcases,
      calculatedhours: calculatedhours,
      sethours: sethours,
      startdate: startdate,
      line: line
    }, this.generateHeader({
      sku: sku,
      numcases: numcases.toString(),
      calculatedhours: calculatedhours.toString(),
      startdate: startdate.toString()
    }))
  }

  ///////////////////// Manufacturing Lines /////////////////////
  getLine(linename: String, linenameregex: String, shortname: String, shortnameregex: String, limit: number): Observable<any> {
    return this.http.get(endpoint + 'manufacturing-lines', this.generateHeader({
      linename: linename,
      linenameregex: linenameregex,
      shortname: shortname,
      shortnameregex: shortnameregex,
      limit: limit
    }));
  }

  createLine(linename: String, shortname: String, skus: [], comment: String): Observable<any> {
    console.log("REST: " + JSON.stringify(skus))
    return this.http.put(endpoint + 'manufacturing-lines', {
      linename: linename,
      shortname: shortname,
      skus: skus,
      comment: comment
    });
  }

  modifyLine(linename: String, newlinename: String, shortname: String, skus: [], comment: String): Observable<any> {
    return this.http.post(endpoint + 'manufacturing-lines', {
      linename: newlinename,
      shortname: shortname,
      skus: skus,
      comment: comment
    }, this.generateHeader({
      linename: linename
    }));
  }

  deleteLine(linename: String): Observable<any> {
    return this.http.delete(endpoint + 'manufacturing-lines', this.generateHeader({
      linename: linename
    }));
  }

}
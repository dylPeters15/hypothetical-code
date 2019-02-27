import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { auth } from './auth.service'
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
  getUsers(username: string, usernameregex: string, admin: boolean, localuser: boolean, limit: number): Promise<any> {
    return this.http.get(endpoint + 'users', this.generateHeader({
      username: username,
      usernameregex: usernameregex,
      admin: admin==null?"":""+admin,
      localuser: localuser==null?"":""+localuser,
      limit: ""+limit
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

  modifyUser(username: string, localuser: boolean, newpassword: string, newadmin: boolean): Promise<any> {
    return this.http.post(endpoint + 'users', {
      password: newpassword||"",
      admin: newadmin==null?"":newadmin
    },
      this.generateHeader({
        username: username,
        localuser: ""+localuser
      })).toPromise();
  }

  deleteUser(username: string, localuser: boolean): Promise<any> {
    return this.http.delete(endpoint + 'users', this.generateHeader({
      username: username,
      localuser: ""+localuser
    })).toPromise();
  }

///////////////////// formulas /////////////////////
getFormulas(formulaname: string, formulanumber: number, ingredient: number, limit: number, formulanameregex?: string, sku?: number): Promise<any> {
  var header = {
    formulaname: formulaname||"",
    formulanameregex: formulanameregex||"$a",
    formulanumber: JSON.stringify(formulanumber||0),
    sku: JSON.stringify(sku||0),
    ingredient: (ingredient||"")+"",
    limit: JSON.stringify(limit||20)
  };

  console.log("Header: ",header);

  return this.http.get(endpoint + "formulas", this.generateHeader(header)).toPromise();
}

createFormula(formulaname: String, formulanumber: Number, ingredientsandquantities: any[], comment: String): Promise<any> {
  console.log("in the rest api!");
  return this.http.put(endpoint + "formulas", {
    formulaname: formulaname,
    formulanumber: formulanumber,
    ingredientsandquantities: ingredientsandquantities,
    comment: comment
  },
  this.generateHeader()).toPromise();
}

modifyFormula(oldname: string, formulaname: string, formulanumber: number, ingredientsandquantities: any[], comment: string): Promise<any> {
  return this.http.post(endpoint + "formulas", {
    formulaname: formulaname,
    formulanumber: formulanumber,
    ingredientsandquantities: ingredientsandquantities,
    comment: comment||""
  },
  this.generateHeader({
    formulaname: oldname
  })).toPromise();
}

deleteFormula(formulanumber: number): Promise<any> {
  return this.http.delete(endpoint + "formulas", this.generateHeader({
    // formulanumber: JSON.stringify(formulanumber)
    formulanumber: formulanumber
  })).toPromise();
}

 ///////////////////// skus /////////////////////
 getSkus(skuName: String, skunameregex: String, skuNumber: number, caseUpcNumber: number, unitUpcNumber: number, formula: String, limit: number): Promise<any> {

  return this.http.get(endpoint + "skus", this.generateHeader({
    skuname: skuName,
    skunameregex: skunameregex,
    skunumber: JSON.stringify(skuNumber),
    caseupcnumber: JSON.stringify(caseUpcNumber),
    unitupcnumber: JSON.stringify(unitUpcNumber),
    formula: formula,
    limit: JSON.stringify(limit)
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

modifySku(oldSkuName: String, skuname: String, skunumber: number, 
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
  this.generateHeader({
    skuname: oldSkuName
  })).toPromise();
}

deleteSku(skuName: String): Promise<any> {
  return this.http.delete(endpoint + "skus", this.generateHeader({
    skuName: skuName,
  })).toPromise();
}


  ///////////////////// ingredients /////////////////////
  getIngredients(ingredientname: String, ingredientnameregex: String, ingredientnumber: number, limit: number): Promise<any> {
    return this.http.get(endpoint + "ingredients", this.generateHeader({
      ingredientname: ingredientname,
      ingredientnameregex: ingredientnameregex,
      ingredientnumber: JSON.stringify(ingredientnumber),
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

modifyIngredient(ingredientname: String,  newingredientname: String, 
  ingredientnumber: number, vendorinformation: String, unitofmeasure: String, 
  amount: number, costperpackage: number, comment: String): Promise<any> {
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
  })).toPromise();
}

deleteIngredient(ingredientname: String): Promise<any> {
  return this.http.delete(endpoint + "ingredients", this.generateHeader({
    ingredientname: ingredientname,
  })).toPromise();
}


  ///////////////////// product lines /////////////////////
  getProductLines(productlinename: String, productlinenameregex: String, limit: number): Promise<any> {
    return this.http.get(endpoint + "product_lines", this.generateHeader({
      productlinename: productlinename,
      productlinenameregex: productlinenameregex,
      limit: JSON.stringify(limit)
    })).toPromise();
  }

  createProductLine(productlinename: String, skus: any[]): Promise<any> {
    return this.http.put(endpoint + "product_lines", {
      productlinename: productlinename,
      skus: skus
    },
    this.generateHeader()).toPromise();
  }

  modifyProductLine(productlinename: String,  newproductlinename: String, skus: any[], ): Promise<any> {
    return this.http.post(endpoint + 'product_lines', {
      productlinename: newproductlinename||"",
      skus: skus||[]
    },
      this.generateHeader({
        productlinename: productlinename
      })).toPromise();
  }

  deleteProductLine(productlinename: String): Promise<any> {
    return this.http.delete(endpoint + "product_lines", this.generateHeader({
      productlinename: productlinename
    })).toPromise();
  }

  ///////////////////// Manufacturing Goals /////////////////////
  getGoals(username: String,  goalname: String, goalnameregex: String, enabled: boolean, limit: number): Promise<any> {
    return this.http.get(endpoint + "manufacturing-goals", this.generateHeader({
      owner: username,
      enabled: JSON.stringify(enabled),
      goalname: goalname,
      goalnameregex: goalnameregex,
      limit: limit
    })).toPromise();
  }

  getUserName(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getUsers(auth.getUsername(), "",null, null, null).then(response =>{
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

  modifyGoal(goalname: String, newgoalname: String, activities: [], date:Date, enabled: boolean): Promise<any> {
    return this.http.post(endpoint + "manufacturing-goals", {
      goalname: newgoalname,
      activities: activities,
      date: date,
      enabled: enabled
    },
    this.generateHeader({
      goalname: goalname
    })).toPromise();
  }



deleteGoal(goalname: String): Promise<any> {
  return this.http.delete(endpoint + "manufacturing-goals", this.generateHeader({
    goalname: goalname
  })).toPromise();
}


  ///////////////////// Manufacturing Activities /////////////////////
  getActivities(startdate: Date, limit: number, line?: string): Promise<any> {
    var header = {
      startdate: JSON.stringify(startdate),
      limit: limit
    };
    if (line) {
      header['line'] = line;
    }
    return this.http.get(endpoint + "manufacturing-activities", this.generateHeader(header)).toPromise();
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

  deleteActivity(activityId: string): Promise<any> {

    return this.http.delete(endpoint + "manufacturing-activities", this.generateHeader({
      _id: activityId
    })).toPromise();
  }

  modifyActivity(sku: string, newsku: string, numcases: number, calculatedhours: number, sethours: number, startdate: Date, line: string): Promise<any> {
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
    })).toPromise();
  }

  ///////////////////// Manufacturing Lines /////////////////////
  getLine(linename: String, linenameregex: String, shortname: String, shortnameregex: String, limit: number): Promise<any> {
    return this.http.get(endpoint + 'manufacturing-lines', this.generateHeader({
      linename: linename,
      linenameregex: linenameregex,
      shortname: shortname,
      shortnameregex: shortnameregex,
      limit: limit
    })).toPromise();
  }

  createLine(linename: String, shortname: String, skus: [], comment: String): Promise<any> {
    console.log("REST: " + JSON.stringify(skus))
    return this.http.put(endpoint + 'manufacturing-lines', {
      linename: linename,
      shortname: shortname,
      skus: skus,
      comment: comment
    }).toPromise();
  }

  modifyLine(linename: String, newlinename: String, shortname: String, skus: [], comment: String): Promise<any> {
    return this.http.post(endpoint + 'manufacturing-lines', {
      linename: newlinename,
      shortname: shortname,
      skus: skus,
      comment: comment
    }, this.generateHeader({
      linename: linename
    })).toPromise();
  }

  deleteLine(linename: String): Promise<any> {
    return this.http.delete(endpoint + 'manufacturing-lines', this.generateHeader({
      linename: linename
    })).toPromise();
  }

}
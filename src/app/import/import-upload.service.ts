import { Injectable } from '@angular/core';
import { RestService } from '../rest.service';

@Injectable({
  providedIn: 'root'
})
export class ImportUploadService {

  constructor(public rest: RestService) { }

  importData(data): Promise<any> {
    return new Promise((resolve, reject) => {
      function resolution() {
        numCompleted = numCompleted + 1;
          if (numCompleted == totalNum) {
            resolve(data);
          }
      };
      function catcher(err) {
        reject(err);
      };
      var numCompleted = 0;
      var totalNum = 5;
      this.importIngredients(data['ingredients']).then(resolution).catch(catcher);
      this.importFormulas(data['formulas']).then(resolution).catch(catcher);
      this.importSKUs(data['skus']).then(resolution).catch(catcher);
      this.importProductLines(data['productlines']).then(resolution).catch(catcher);
      this.importManufacturingLines(data['manufacturinglines']).then(resolution).catch(catcher);
    });
  }

  private importIngredients(ingredients): Promise<any> {
    return new Promise((resolve, reject) => {
      var numIngredientsProcessed = 0;
      var totalIngredients = ingredients['new'].length;//+conflicted
      if (totalIngredients == 0) {
        resolve();
      }
      ingredients['new'].forEach(ingredient => {
        this.rest.createIngredient(ingredient['Name'], ingredient['Ingr#'], ingredient['Vendor Info'], "lb", 5, 10, ingredient['comment']).subscribe(result => {
          console.log("Create ingredient result: ",result);
          if (result['ingredientname'] == ingredient['Name']) {
            console.log(numIngredientsProcessed);
            if (++numIngredientsProcessed==totalIngredients) {
              resolve();
            }
          } else {
            reject(result);
          }
        });
      });
    });
  }

  private importFormulas(formulas): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  private importSKUs(skus): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  private importProductLines(productLines): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  private importManufacturingLines(manufacturingLines): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}

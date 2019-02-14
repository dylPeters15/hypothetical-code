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

  private numConflictedSelectNew(data) {
    return this.numConflictedSelectNewOfSection(data['ingredients'])
    + this.numConflictedSelectNewOfSection(data['formulas'])
    + this.numConflictedSelectNewOfSection(data['skus'])
    + this.numConflictedSelectNewOfSection(data['productlines'])
    + this.numConflictedSelectNewOfSection(data['manufacturinglines']);
  }

  private numConflictedSelectNewOfSection(data) {
    var total = 0;
    for (var i = 0; i < data['conflicts'].length; i++) {
      if (data['conflicts'][i]['select'] == 'new') {
        total++;
      }
    }
    return total;
  }

  private importIngredients(ingredients): Promise<any> {
    return new Promise((resolve, reject) => {
      var numIngredientsProcessed = 0;
      var totalIngredients = ingredients['new'].length+this.numConflictedSelectNewOfSection(ingredients);
      if (totalIngredients == 0) {
        resolve();
      }
      ingredients['conflicts'].forEach(conflict => {
        if (conflict['select'] == 'new') {
          var ingredient = conflict['new'];
          this.rest.modifyIngredient(conflict['old'][0]['ingredientname'], ingredient['Name'], ingredient['Ingr#'], ingredient['Vendor Info'], "lb", 5, 10, ingredient['comment']).subscribe(result => {
            if (result['ok'] == 1) {
              if (++numIngredientsProcessed==totalIngredients) {
                resolve();
              }
            } else {
              reject(result);
            }
          });
        }
      });
      ingredients['new'].forEach(ingredient => {
        this.rest.createIngredient(ingredient['Name'], ingredient['Ingr#'], ingredient['Vendor Info'], "lb", 5, 10, ingredient['comment']).subscribe(result => {
          if (result['ingredientname'] == ingredient['Name']) {
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
      var numPLsProcessed = 0;
      var totalPLs = productLines['new'].length+this.numConflictedSelectNewOfSection(productLines);
      if (totalPLs == 0) {
        resolve();
      }
      productLines['new'].forEach(productLine => {
        this.rest.createProductLine(productLine['Name'], []).subscribe(result => {
          if (result['productlinename'] == productLine['Name']) {
            if (++numPLsProcessed==totalPLs) {
              resolve();
            }
          } else {
            reject(result);
          }
        });
      });
    });
  }

  private importManufacturingLines(manufacturingLines): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}

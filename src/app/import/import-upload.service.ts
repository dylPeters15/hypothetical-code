import { Injectable } from '@angular/core';
import { RestService } from '../rest.service';

@Injectable({
  providedIn: 'root'
})
export class ImportUploadService {

  constructor(public rest: RestService) { }

  importData(data): Promise<any> {
    return new Promise((resolve, reject) => {
      function catcher(err) {
        reject(err);
      };
      this.importIngredients(data['ingredients']).then(ingredientResult => {
        this.importFormulas(data['formulas']).then(formulaResult => {
          this.importSKUs(data['skus']).then(skuResult => {
            this.importProductLines(data['productlines']).then(productLineResult => {
              resolve();
            }).catch(catcher);
          }).catch(catcher);
        }).catch(catcher);
      }).catch(catcher);
    });
  }

  private numConflictedSelectNew(data) {
    return this.numConflictedSelectNewOfSection(data['ingredients'])
    + this.numConflictedSelectNewOfSection(data['formulas'])
    + this.numConflictedSelectNewOfSection(data['skus'])
    + this.numConflictedSelectNewOfSection(data['productlines']);
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
          this.rest.modifyIngredient(conflict['old'][0]['ingredientname'], ingredient['Name'], ingredient['Ingr#'], ingredient['Vendor Info'], ingredient['unitofmeasure'], ingredient['amount'], ingredient['costperpackage'], ingredient['comment']).subscribe(result => {
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
        this.rest.createIngredient(ingredient['Name'], ingredient['Ingr#'], ingredient['Vendor Info'], ingredient['unitofmeasure'], ingredient['amount'], ingredient['costperpackage'], ingredient['comment']).subscribe(result => {
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
  
}

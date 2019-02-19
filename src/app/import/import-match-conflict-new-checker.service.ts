import { Injectable } from '@angular/core';
import { RestService } from '../rest.service';

@Injectable({
  providedIn: 'root'
})
export class ImportMatchConflictNewCheckerService {

  constructor(private rest: RestService) { }

  checkAll(input): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      var numFinished = 0;
      var totalNum = 6;
      this.checkSKUsMatchesConflictsNew(input['skus']).then(result => {
        toReturn['skus'] = result;
        numFinished = numFinished + 1;
        if (numFinished == totalNum) {
          resolve(toReturn);
        }
      }).catch(err => {
        reject(err);
      });
      this.checkIngredientsMatchesConflictsNew(input['ingredients']).then(result => {
        toReturn['ingredients'] = result;
        numFinished = numFinished + 1;
        if (numFinished == totalNum) {
          resolve(toReturn);
        }
      }).catch(err => {
        reject(err);
      });
      this.checkProductLinesMatchesConflictsNew(input['productlines']).then(result => {
        toReturn['productlines'] = result;
        numFinished = numFinished + 1;
        if (numFinished == totalNum) {
          resolve(toReturn);
        }
      }).catch(err => {
        reject(err);
      });
      this.checkFormulasMatchesConflictsNew(input['formulas'], input['formulaingredients']).then(result => {
        toReturn['formulas'] = result;
        numFinished = numFinished + 1;
        if (numFinished == totalNum) {
          resolve(toReturn);
        }
      }).catch(err => {
        reject(err);
      });
      this.checkFormulaReferences(input['formulas'], input['ingredients']).then(result => {
        toReturn['formulaRefErrs'] = result;
        numFinished = numFinished + 1;
        if (numFinished == totalNum) {
          resolve(toReturn);
        }
      }).catch(err => {
        reject(err);
      });
      this.checkSKUReferences(input['skus'], input['productlines'], input['formulas']).then(result => {
        toReturn['skuRefErrs'] = result;
        numFinished = numFinished + 1;
        if (numFinished == totalNum) {
          resolve(toReturn);
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  private checkSKUsMatchesConflictsNew(skus): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      toReturn['matches'] = [];
      toReturn['conflicts'] = [];
      toReturn['new'] = [];
      //do processing here
      //can't do this yet because I'm blocked since SKU support is not ready in rest.service.ts yet
      var numSKUsProcessed = 0;
      skus.forEach(sku => {
        numSKUsProcessed = numSKUsProcessed + 1;
        if (numSKUsProcessed == skus.length) {
          resolve(toReturn);
        }
      });
    });
  }

  private checkIngredientsMatchesConflictsNew(ingredients): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      toReturn['matches'] = [];
      toReturn['conflicts'] = [];
      toReturn['new'] = [];
      var numIngredientsProcessed = 0;
      ingredients.forEach(ingredient => {
        //do processing here
        this.rest.getIngredients(ingredient['ingredientname'], ingredient['ingredientnumber'], 1).subscribe(response => {
          if (response.length == 0) {
            toReturn['new'].push(ingredient);
          } else {
            var responseIngredient = response[0];
            if (ingredient['ingredientname'] == responseIngredient['ingredientname']
            && ingredient['ingredientnumber'] == responseIngredient['ingredientnumber']
            && ingredient['vendorinformation'] == responseIngredient['vendorinformation']
            && ingredient['unitofmeasure'] == responseIngredient['unitofmeasure']
            && ingredient['amount'] == responseIngredient['amount']
            && ingredient['costperpackage'] == responseIngredient['costperpackage']
            && ingredient['comment'] == responseIngredient['comment']
            ) {
              toReturn['matches'].push(ingredient);
            } else {
              toReturn['conflicts'].push({
                old: response,
                new: ingredient,
                select: 'new'
              });
            }
          }
          numIngredientsProcessed = numIngredientsProcessed + 1;
          if (numIngredientsProcessed == ingredients.length) {
            resolve(toReturn);
          }
        });
      });
    });
  }

  private checkProductLinesMatchesConflictsNew(productLines): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      toReturn['matches'] = [];
      toReturn['conflicts'] = [];
      toReturn['new'] = [];
      var numPLsProcessed = 0;
      productLines.forEach(productLine => {
        //do processing here
        this.rest.getProductLines(productLine['Name'], 1).subscribe(result => {
          if (result.length == 0) {
            toReturn['new'].push(productLine);
          } else {
            toReturn['matches'].push(productLine);
          }
          numPLsProcessed = numPLsProcessed + 1;
          if (numPLsProcessed == productLines.length) {
            resolve(toReturn);
          }
        });
      });
    });
  }

  private arrayContainsObjectWithKey(array: any[], key: string): boolean {
    for (var i = 0; i < array.length; i++) {
      if (Object.keys(array[i]).includes(key)) {
        return true;
      }
    }
    return false;
  }

  private arrayObjectWithKey(array: any[], key: string): any {
    for (var i = 0; i < array.length; i++) {
      if (Object.keys(array[i]).includes(key)) {
        return array[i];
      }
    }
    return null;
  }

  private checkFormulasMatchesConflictsNew(formulas, formulaIngredients): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      toReturn['matches'] = [];
      toReturn['conflicts'] = [];
      toReturn['new'] = [];
      var numFormulasProcessed = 0;
      formulas.forEach(formula => {
        //do processing here
        this.rest.getFormulas(formula['formulaname'], null, null, null, 20).subscribe(response => {
          console.log("Formula: ", formula);
          console.log("Formula Response",response);
          if (response.length == 0) {
            toReturn['new'].push(formula);
          } else {
            var responseFormula = response[0];
            var sameIngredientsAndQuantities = responseFormula['ingredientsandquantities'].length == formula['ingredientsandquantities'].length;
            for (var i = 0; i < formula['ingredientsandquantities'].length; i++) {
              if (this.arrayContainsObjectWithKey(responseFormula['ingredientsandquantities'], formula['ingredientsandquantities'][i]['ingredient'])) {
                if (this.arrayObjectWithKey(responseFormula['ingredientsandquantities'], formula['ingredientsandquantities'][i]['ingredient'])['quantity'] != formula['ingredientsandquantities'][i]['quantity']) {
                  sameIngredientsAndQuantities = false;
                }
              } else {
                sameIngredientsAndQuantities = false;
              }
            }
            if (responseFormula['formulaname'] == formula['formulaname']
            && responseFormula['formulanumber'] == formula['formulanumber']
            && responseFormula['comment'] == formula['comment']
            && sameIngredientsAndQuantities) {
              toReturn['matches'].push(formula);
            } else {
              toReturn['conflicts'].push(formula);
            }
          }
        });
        numFormulasProcessed = numFormulasProcessed + 1;
        if (numFormulasProcessed == formulas.length) {
          resolve(toReturn);
        }
      });
    });
  }

  /**
   * Objects Formulas reference that could cause errors:
   * ingredients
   */
  private checkFormulaReferences(formulas, ingredients): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      toReturn['matches'] = [];
      toReturn['conflicts'] = [];
      toReturn['new'] = [];
      var numFormulasProcessed = 0;
      formulas.forEach(formula => {
        //do processing here
        //can't do this yet because I'm blocked since formula support is not ready in rest.service.ts yet
        numFormulasProcessed = numFormulasProcessed + 1;
        if (numFormulasProcessed == formulas.length) {
          resolve(toReturn);
        }
      });
    });
  }

  /**
   * Objects SKUs reference that could cause errors:
   * Product Line
   * Formula
   */
  private checkSKUReferences(skus, productLines, formulas): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      toReturn['matches'] = [];
      toReturn['conflicts'] = [];
      toReturn['new'] = [];
      var numFormulasProcessed = 0;
      formulas.forEach(formula => {
        //do processing here
        //can't do this yet because I'm blocked since formulas support is not ready in rest.service.ts yet
        numFormulasProcessed = numFormulasProcessed + 1;
        if (numFormulasProcessed == formulas.length) {
          resolve(toReturn);
        }
      });
    });
  }

}

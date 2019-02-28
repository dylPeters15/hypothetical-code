import { Injectable } from '@angular/core';
import { RestService } from '../rest.service';

@Injectable({
  providedIn: 'root'
})
export class ImportMatchConflictNewCheckerService {

  constructor(private rest: RestService) { }

  checkAll(input): Promise<any> {
    console.log("Input: ",input);
    return new Promise((resolve, reject) => {
      var toReturn = {};
      var numFinished = 0;
      var totalNum = 6;
      this.checkSKUsMatchesConflictsNew(input['skus']).then(result => {
        toReturn['skus'] = result||{
          new: [],
          conflicts: [],
          matches: []
        };
        numFinished = numFinished + 1;
        if (numFinished == totalNum) {
          resolve(toReturn);
        }
      }).catch(err => {
        reject(err);
      });
      this.checkIngredientsMatchesConflictsNew(input['ingredients']).then(result => {
        toReturn['ingredients'] = result||{
          new: [],
          conflicts: [],
          matches: []
        };
        numFinished = numFinished + 1;
        if (numFinished == totalNum) {
          resolve(toReturn);
        }
      }).catch(err => {
        reject(err);
      });
      this.checkProductLinesMatchesConflictsNew(input['productlines']).then(result => {
        toReturn['productlines'] = result||{
          new: [],
          conflicts: [],
          matches: []
        };
        numFinished = numFinished + 1;
        if (numFinished == totalNum) {
          resolve(toReturn);
        }
      }).catch(err => {
        reject(err);
      });
      this.checkFormulasMatchesConflictsNew(input['formulas']).then(result => {
        toReturn['formulas'] = result||{
          new: [],
          conflicts: [],
          matches: []
        };
        numFinished = numFinished + 1;
        if (numFinished == totalNum) {
          resolve(toReturn);
        }
      }).catch(err => {
        reject(err);
      });
      this.checkFormulaReferences(input['formulas'], input['ingredients']).then(result => {
        toReturn['formulaRefErrs'] = result||{
          new: [],
          conflicts: [],
          matches: []
        };
        numFinished = numFinished + 1;
        if (numFinished == totalNum) {
          resolve(toReturn);
        }
      }).catch(err => {
        reject(err);
      });
      this.checkSKUReferences(input['skus'], input['productlines'], input['formulas']).then(result => {
        toReturn['skuRefErrs'] = result||{
          new: [],
          conflicts: [],
          matches: []
        };
        numFinished = numFinished + 1;
        if (numFinished == totalNum) {
          resolve(toReturn);
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  private checkSKUMatchConflictNew(sku, toReturn): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(sku);
      // this.rest.getSkus(sku['skuname'],"$a", sku['skunumber'], 100, 100, "", 1).subscribe(response => {
      //   if (response.length == 0) {
      //     toReturn['new'].push(sku);
      //     resolve();
      //   } else {
      //     var responseSku = response[0];
      //     var match = true;
      //     console.log("SKU",sku);
      //     console.log("RESPONSESKU",responseSku);
      //     match = sku['skuname'] == responseSku['skuname']
      //     && sku['skunumber'] == responseSku['skunumber']
      //     && sku['caseupcnumber'] == responseSku['caseupcnumber']
      //     && sku['unitupcnumber'] == responseSku['unitupcnumber']
      //     && sku['unitsize'] == responseSku['unitsize']
      //     && sku['countpercase'] == responseSku['countpercase']
      //     && sku['formula'] == responseSku['formula']['formulanumber']
      //     && sku['formulascalingfactor'] == responseSku['formulascalingfactor']
      //     && sku['manufacturingrate'] == responseSku['manufacturingrate']
      //     && sku['comment'] == responseSku['comment'];

      //     if (match) {
      //       toReturn['matches'].push(sku);
      //     } else {
      //       responseSku['Name'] = responseSku['skuname'];
      //       toReturn['conflicts'].push({
      //         old: [responseSku],
      //         new: sku,
      //         select: 'new'
      //       })
      //     }
      //     resolve();
      //   }
      // });
    });
  }

  private checkSKUsMatchesConflictsNew(skus): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      toReturn['matches'] = [];
      toReturn['conflicts'] = [];
      toReturn['new'] = [];
      //do processing here
      var numSKUsProcessed = 0;
      if (skus.length == 0) {
        resolve();
      }
      skus.forEach(sku => {
        this.checkSKUMatchConflictNew(sku, toReturn).then(() => {
          numSKUsProcessed = numSKUsProcessed + 1;
          if (numSKUsProcessed == skus.length) {
            resolve(toReturn);
          }
        }).catch(err => {
          console.log('error here')
          reject(Error(err));
        });
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
      if (ingredients.length == 0) {
        resolve();
      }
      ingredients.forEach(ingredient => {
        //do processing here
        // this.rest.getIngredients(ingredient['ingredientname'],"", ingredient['ingredientnumber'], 1).subscribe(response => {
        //   if (response.length == 0) {
        //     toReturn['new'].push(ingredient);
        //   } else {
        //     var responseIngredient = response[0];
        //     if (ingredient['ingredientname'] == responseIngredient['ingredientname']
        //       && ingredient['ingredientnumber'] == responseIngredient['ingredientnumber']
        //       && ingredient['vendorinformation'] == responseIngredient['vendorinformation']
        //       && ingredient['unitofmeasure'] == responseIngredient['unitofmeasure']
        //       && ingredient['amount'] == responseIngredient['amount']
        //       && ingredient['costperpackage'] == responseIngredient['costperpackage']
        //       && ingredient['comment'] == responseIngredient['comment']
        //     ) {
        //       toReturn['matches'].push(ingredient);
        //     } else {
        //       toReturn['conflicts'].push({
        //         old: response,
        //         new: ingredient,
        //         select: 'new'
        //       });
        //     }
        //   }
        //   numIngredientsProcessed = numIngredientsProcessed + 1;
        //   if (numIngredientsProcessed == ingredients.length) {
        //     resolve(toReturn);
        //   }
        // });
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
      if (productLines.length == 0) {
        resolve();
      }
      productLines.forEach(productLine => {
        //do processing here
        // this.rest.getProductLines(productLine['Name'], "", 1).subscribe(result => {
        //   if (result.length == 0) {
        //     toReturn['new'].push(productLine);
        //   } else {
        //     toReturn['matches'].push(productLine);
        //   }
        //   numPLsProcessed = numPLsProcessed + 1;
        //   if (numPLsProcessed == productLines.length) {
        //     resolve(toReturn);
        //   }
        // });
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

  private arrayContainsObjectWithKeyVal(array: any[], key: string, val: string): boolean {
    for (var i = 0; i < array.length; i++) {
      if (Object.keys(array[i]).includes(key) && array[i][key] == val) {
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

  private arrayObjectWithKeyVal(array: any[], key: string, val: string): any {
    for (var i = 0; i < array.length; i++) {
      if (Object.keys(array[i]).includes(key) && array[i][key] == val) {
        return array[i];
      }
    }
    return null;
  }

  private responseFormulaContainsIngredientAndQuantity(responseFormula, ingredientnum, quantity): boolean {
    for (var i = 0; i < responseFormula['ingredientsandquantities'].length; i++) {
      var IAndQ = responseFormula['ingredientsandquantities'][i];
      if (IAndQ['ingredient']['ingredientnumber'] == ingredientnum) {
        return IAndQ['quantity'] == quantity;
      }
    }
    return false;
  }

  private checkFormulaMatchConflictNew(formula, toReturn): Promise<any> {
    return new Promise((resolve, reject) => {
      // this.rest.getFormulas(formula['formulaname'], formula['formulanumber'], null, 1).subscribe(response => {
      //   if (response.length == 0) {
      //     toReturn['new'].push(formula);
      //     resolve();
      //   } else {
      //     var responseFormula = response[0];
      //     var sameIngredientsAndQuantities = responseFormula['ingredientsandquantities'].length == formula['ingredientsandquantities'].length;
      //     for (var i = 0; i < formula['ingredientsandquantities'].length; i++) {
      //       if (!this.responseFormulaContainsIngredientAndQuantity(responseFormula, formula['ingredientsandquantities'][i]['ingredient'], formula['ingredientsandquantities'][i]['quantity'])) {
      //         sameIngredientsAndQuantities = false;
      //       }
      //     }
      //     if (responseFormula['formulaname'] == formula['formulaname']
      //       && responseFormula['formulanumber'] == formula['formulanumber']
      //       && responseFormula['comment'] == formula['comment']
      //       && sameIngredientsAndQuantities
      //       ) {
      //       toReturn['matches'].push(formula);
      //     } else {
      //       responseFormula['Name'] = responseFormula['formulaname'];
      //       toReturn['conflicts'].push({
      //         old: [responseFormula],
      //         new: formula,
      //         select: 'new'
      //       });
      //     }
      //     resolve();
      //   }
      // });
    });
  }

  private checkFormulasMatchesConflictsNew(formulas): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      toReturn['matches'] = [];
      toReturn['conflicts'] = [];
      toReturn['new'] = [];
      var numFormulasProcessed = 0;
      if (formulas.length == 0) {
        resolve();
      }
      formulas.forEach(formula => {
        //do processing here
        this.checkFormulaMatchConflictNew(formula, toReturn).then(() => {
          numFormulasProcessed++;
          if (numFormulasProcessed == formulas.length) {
            resolve(toReturn);
          }
        }).catch(err => {
          reject(err);
        });
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
      if (formulas.length == 0) {
        resolve();
      }
      formulas.forEach(formula => {
        //do processing here
        var numIngredientsChecked = 0;
        for (let ingredientAndQuantity of formula['ingredientsandquantities']) {
          var ingredientnum = ingredientAndQuantity['ingredient'];
          if (this.arrayContainsObjectWithKeyVal(ingredients, 'ingredientnumber', ingredientnum)) {
            numIngredientsChecked++;
            if (numIngredientsChecked == formula['ingredientsandquantities'].length) {
              numFormulasProcessed = numFormulasProcessed + 1;
              if (numFormulasProcessed == formulas.length) {
                resolve(toReturn);
              }
            }
          } else {
            // this.rest.getIngredients("","", ingredientnum, 1).subscribe(response => {
            //   if (response.length == 0) {
            //     reject(Error("Could not find ingredient " + ingredientnum + " for formula " + formula['formulaname']));
            //   } else {
            //     numIngredientsChecked++;
            //     if (numIngredientsChecked == formula['ingredientsandquantities'].length) {
            //       numFormulasProcessed = numFormulasProcessed + 1;
            //       if (numFormulasProcessed == formulas.length) {
            //         resolve(toReturn);
            //       }
            //     }
            //   }
            // });
          }
        }
      });
    });
  }

  private checkSKUReference(sku, productLines, formulas): Promise<any> {
    return new Promise((resolve, reject) => {
      var numMLsChecked = 0;
      // if (sku['manufacturinglines'].length == 0) {
        console.log(sku['formula'])
        // this.rest.getFormulas("", sku['formula'], 0, 1).subscribe(formulaResponse => {
        //   console.log(formulaResponse)
        //   if (formulaResponse.length == 1 || this.arrayContainsObjectWithKeyVal(formulas, 'formulanumber', sku['formula'])) {
        //     resolve();
        //   } else {
        //     reject(Error("Could not find formula " + sku['formula'] + " for SKU " + sku['skuname']));
        //   }
        // });
      // }
      sku['manufacturinglines'].forEach(shortname => {
        // this.rest.getLine("","",shortname,"",1).subscribe(mlResponse => {
        //   console.log(mlResponse);
        //   if (mlResponse.length == 1) {
        //     numMLsChecked++;
        //     if (numMLsChecked >= sku['manufacturinglines'].length) {
        //       this.rest.getFormulas("", sku['formula'], null, 1).subscribe(formulaResponse => {
        //         console.log(formulaResponse);
        //         if (formulaResponse.length == 1 || this.arrayContainsObjectWithKeyVal(formulas, 'formulanumber', sku['formula'])) {
        //           resolve();
        //         } else {
        //           reject(Error("Could not find formula " + sku['formula'] + " for SKU " + sku['skuname']));
        //         }
        //       });
        //     }
        //   } else {
        //     reject(Error("Could not find Manufacturing Line " + shortname + " for SKU " + sku['skuname']));
        //   }
        // });
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
      if (skus.length == 0) {
        resolve();
      }
      skus.forEach(sku => {
        //do processing here
        this.checkSKUReference(sku, productLines, formulas).then(() => {
          numFormulasProcessed = numFormulasProcessed + 1;
          if (numFormulasProcessed == formulas.length) {
            resolve(toReturn);
          }
        }).catch(err => {
          reject(err);
        });
      });
    });
  }

}
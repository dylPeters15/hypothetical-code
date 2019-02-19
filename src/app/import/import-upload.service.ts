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
        console.log("finished ingredients.");
        this.importFormulas(data['formulas']).then(formulaResult => {
          console.log("finished formulas.");
          this.importProductLines(data['productlines']).then(productLineResult => {
            console.log("finished product lines.");
            this.importSKUs(data['skus']).then(skuResult => {
              console.log("finished skus.");
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
          this.rest.modifyIngredient(conflict['old'][0]['ingredientname'], ingredient['ingredientname'], ingredient['ingredientnumber'], ingredient['vendorinformation'], ingredient['unitofmeasure'], ingredient['amount'], ingredient['costperpackage'], ingredient['comment']).subscribe(result => {
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
        this.rest.createIngredient(ingredient['ingredientname'], ingredient['ingredientnumber'], ingredient['vendorinformation'], ingredient['unitofmeasure'], ingredient['amount'], ingredient['costperpackage'], ingredient['comment']).subscribe(result => {
          if (result['ingredientname'] == ingredient['ingredientname']) {
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

  private importFormula(formula): Promise<any> {
    return new Promise((resolve, reject) => {
      var numIngredientsProcessed = 0;
      var ingredientsAndQuantities = [];
      formula['ingredientsandquantities'].forEach(ingredientAndQuantity => {
        var ingredientnum = ingredientAndQuantity['ingredient'];
        this.rest.getIngredients("",ingredientnum,1).subscribe(response => {
          if (response.length == 0) {
            reject(Error("Could not find ingredient " + ingredientnum + " for formula " + formula['formulaname']));
          } else {
            var ingredientID = response[0]['_id'];
            ingredientsAndQuantities.push({
              ingredient: ""+ingredientID,
              quantity: ingredientAndQuantity['quantity']
            });
            numIngredientsProcessed++;
            if (numIngredientsProcessed == formula['ingredientsandquantities'].length) {
              this.rest.createFormula(formula['formulaname'], formula['formulanumber'], ingredientsAndQuantities, formula['comment']||"").subscribe(createResponse => {
                if (createResponse['formulaname'] == formula['formulaname']) {
                  resolve();
                } else {
                  reject(Error("Error creating formula."));
                }
              });
            }
          }
        });
      });
    });
  }

  private updateFormula(oldname, formula): Promise<any> {
    return new Promise((resolve, reject) => {
      var numIngredientsProcessed = 0;
      var ingredientsAndQuantities = [];
      formula['ingredientsandquantities'].forEach(ingredientAndQuantity => {
        var ingredientnum = ingredientAndQuantity['ingredient'];
        this.rest.getIngredients("",ingredientnum,1).subscribe(response => {
          if (response.length == 0) {
            reject(Error("Could not find ingredient " + ingredientnum + " for formula " + formula['formulaname']));
          } else {
            var ingredientID = response[0]['_id'];
            ingredientsAndQuantities.push({
              ingredient: ""+ingredientID,
              quantity: ingredientAndQuantity['quantity']
            });
            numIngredientsProcessed++;
            if (numIngredientsProcessed == formula['ingredientsandquantities'].length) {
              this.rest.modifyFormula(oldname, formula['formulaname'], formula['formulanumber'], ingredientsAndQuantities, formula['comment']||"").subscribe(modifyResponse => {
                if (modifyResponse['ok'] == 1) {
                  resolve();
                } else {
                  reject(Error("Error creating formula."));
                }
              });
            }
          }
        });
      });
    });
  }

  private importFormulas(formulas): Promise<any> {
    return new Promise((resolve, reject) => {
      var numFormulasToProcess = formulas['new'].length+this.numConflictedSelectNewOfSection(formulas);
      var numFormulasProcessed = 0;
      if (numFormulasToProcess == 0) {
        resolve();
      }
      formulas['new'].forEach(formula => {
        this.importFormula(formula).then(() => {
          numFormulasProcessed++;
          if (numFormulasProcessed >= numFormulasToProcess) {
            resolve();
          }
        }).catch(err => {
          reject(err);
        });
      });
      formulas['conflicts'].forEach(conflict => {
        if (conflict['select'] == 'new') {
          this.updateFormula(conflict['old'][0]['formulaname'], conflict['new']).then(() => {
            numFormulasProcessed++;
            if (numFormulasProcessed >= numFormulasToProcess) {
              resolve();
            }
          }).catch(err => {
            reject(err);
          });
        }
      });
    });
  }

  private importSKU(sku): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log("SKU: ",sku);
      this.rest.createSku(sku['skuname'], sku['skunumber'], sku['caseupcnumber'], sku['unitupcnumber'], sku['unitsize'], sku['countpercase'], sku['formula'], sku['formulascalingfactor'], sku['manufacturingrate'], sku['comment']).subscribe(createSkuResponse => {
        if (createSkuResponse['skuname'] == sku['skuname']) {
          this.rest.getProductLines(sku['productline'],1).subscribe
          (getPLResponse => {
            if (getPLResponse.length == 0) {
              reject(Error("Could not find product line " + sku['productline'] + " for SKU " + sku['skuname']));
            } else {
              var skus = getPLResponse[0]['skus'];
              skus.push({
                sku: createSkuResponse['_id']
              })
              this.rest.modifyProductLine(sku['productline'], sku['productline'], skus).subscribe(modifyPLResponse => {
                if (modifyPLResponse['ok'] == 1) {
                  resolve();
                } else {
                  reject(Error("Could not modify Product Line " + sku['productline'] + " for SKU " + sku['skuname']));
                }
              });
            }
          });
        } else {
          reject(Error("Could not create SKU " + sku['skuname']));
        }
      });
    });
  }

  private updateSKU(sku): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  private importSKUs(skus): Promise<any> {
    return new Promise((resolve, reject) => {
      var numSKUsProcessed = 0;
      var totalSKUs = skus['new'].length+this.numConflictedSelectNewOfSection(skus);
      if (totalSKUs == 0) {
        resolve();
      }
      skus['new'].forEach(sku => {
        this.importSKU(sku).then(() => {
          numSKUsProcessed++;
          if (numSKUsProcessed >= totalSKUs) {
            resolve();
          }
        }).catch(err => {
          reject(err);
        });
      });
      skus['conflicts'].forEach(conflict => {
        if (conflict['select'] == 'new') {
          this.updateSKU(conflict['new']).then(() => {
            numSKUsProcessed++;
            if (numSKUsProcessed >= totalSKUs) {
              resolve();
            }
          }).catch(err => {
            reject(err);
          });
        }
      });
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

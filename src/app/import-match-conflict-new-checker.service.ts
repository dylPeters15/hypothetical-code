import { Injectable } from '@angular/core';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class ImportMatchConflictNewCheckerService {

  constructor(private rest: RestService) { }

  checkAll(input): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      var numFinished = 0;
      var totalNum = 8;
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
      this.checkManufacturingLinesMatchesConflictsNew(input['manufacturinglines'], input['skumanufacturinglines']).then(result => {
        toReturn['manufacturinglines'] = result;
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
      this.checkManufacturingLineReferences(input['manufacturinglines'], input['skus']).then(result => {
        toReturn['manufacturingLineRefErrs'] = result;
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
        console.log(sku);
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
        console.log(ingredient);
        //do processing here
        numIngredientsProcessed = numIngredientsProcessed + 1;
        if (numIngredientsProcessed == ingredients.length) {
          resolve(toReturn);
        }
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
        console.log(productLine);
        //do processing here
        numPLsProcessed = numPLsProcessed + 1;
        if (numPLsProcessed == productLines.length) {
          resolve(toReturn);
        }
      });
    });
  }

  private checkFormulasMatchesConflictsNew(formulas, formulaIngredients): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      toReturn['matches'] = [];
      toReturn['conflicts'] = [];
      toReturn['new'] = [];
      var numFormulasProcessed = 0;
      formulas.forEach(formula => {
        console.log(formula);
        //do processing here
        numFormulasProcessed = numFormulasProcessed + 1;
        if (numFormulasProcessed == formulas.length) {
          resolve(toReturn);
        }
      });
    });
  }

  private checkManufacturingLinesMatchesConflictsNew(manufacturingLines, skuManufacturingLines): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      toReturn['matches'] = [];
      toReturn['conflicts'] = [];
      toReturn['new'] = [];
      var numMLsProcessed = 0;
      manufacturingLines.forEach(manufacturingLine => {
        console.log(manufacturingLine);
        //do processing here
        numMLsProcessed = numMLsProcessed + 1;
        if (numMLsProcessed == manufacturingLines.length) {
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
        console.log(formula);
        //do processing here
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
        console.log(formula);
        //do processing here
        numFormulasProcessed = numFormulasProcessed + 1;
        if (numFormulasProcessed == formulas.length) {
          resolve(toReturn);
        }
      });
    });
  }

  /**
   * Objects Manufacturing Lines reference that could cause errors:
   * SKUs
   */
  private checkManufacturingLineReferences(manufacturingLines, skus): Promise<any> {
    return new Promise((resolve, reject) => {
      var toReturn = {};
      toReturn['matches'] = [];
      toReturn['conflicts'] = [];
      toReturn['new'] = [];
      //do processing here
      //can't do this yet because I'm blocked since SKU support is not ready in rest.service.ts yet
      var numSKUsProcessed = 0;
      skus.forEach(sku => {
        console.log(sku);
        numSKUsProcessed = numSKUsProcessed + 1;
        if (numSKUsProcessed == skus.length) {
          resolve(toReturn);
        }
      });
    });
  }

}

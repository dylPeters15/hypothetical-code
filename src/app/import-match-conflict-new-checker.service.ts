import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportMatchConflictNewCheckerService {

  constructor() { }

  checkAll(input): any {
    var toReturn = {};
    toReturn['skus'] = this.checkSKUsMatchesConflictsNew(input['skus']);
    toReturn['ingredients'] = this.checkIngredientsMatchesConflictsNew(input['ingredients']);
    toReturn['productlines'] = this.checkProductLinesMatchesConflictsNew(input['productlines']);
    toReturn['formulas'] = this.checkFormulasMatchesConflictsNew(input['formulas'], input['formulaingredients']);
    toReturn['manufacturinglines'] = this.checkManufacturingLinesMatchesConflictsNew(input['manufacturinglines'], input['skumanufacturinglines']);
    toReturn['formulaRefErrs'] = this.checkFormulaReferences(input['formulas'], input['ingredients']);
    toReturn['skuRefErrs'] = this.checkSKUReferences(input['skus'], input['productlines'], input['formulas']);
    toReturn['manufacturingLineRefErrs'] = this.checkManufacturingLineReferences(input['manufacturinglines'], input['skus']);
  }

  private checkSKUsMatchesConflictsNew(skus): any {

  }

  private checkIngredientsMatchesConflictsNew(ingredients): any {

  }

  private checkProductLinesMatchesConflictsNew(productLines): any {

  }

  private checkFormulasMatchesConflictsNew(formulas, formulaIngredients): any {

  }

  private checkManufacturingLinesMatchesConflictsNew(manufacturingLines, skuManufacturingLines): any {

  }

  /**
   * Objects Formulas reference that could cause errors:
   * ingredients
   */
  private checkFormulaReferences(formulas, ingredients): any {

  }

  /**
   * Objects SKUs reference that could cause errors:
   * Product Line
   * Formula
   */
  private checkSKUReferences(skus, productLines, formulas): any {

  }

  /**
   * Objects Manufacturing Lines reference that could cause errors:
   * SKUs
   */
  private checkManufacturingLineReferences(manufacturingLines, skus): any {

  }

}

import { Injectable } from '@angular/core';
import { RestServiceV2, AndVsOr } from '../restv2.service';

@Injectable({
  providedIn: 'root'
})
export class ImportMatchConflictNewCheckerService {

  constructor(private restv2: RestServiceV2) { }

  async checkAll(input): Promise<any> {
    console.log("Input: ", input);
    var toReturn = {};
    var defaultObject = {
      new: [],
      conflicts: [],
      matches: []
    };

    var result = await this.checkSKUsMatchesConflictsNew(input['skus']);
    toReturn['skus'] = result || defaultObject;

    var result = await this.checkIngredientsMatchesConflictsNew(input['ingredients']);
    toReturn['ingredients'] = result || defaultObject;

    var result = await this.checkProductLinesMatchesConflictsNew(input['productlines']);
    toReturn['productlines'] = result || defaultObject;

    var result = await this.checkFormulasMatchesConflictsNew(input['formulas']);
    toReturn['formulas'] = result || defaultObject;

    var result = await this.checkFormulaReferences(input['formulas'], input['ingredients']);
    toReturn['formulaRefErrs'] = result || defaultObject;

    var result = await this.checkSKUReferences(input['skus'], input['productlines'], input['formulas']);
    toReturn['skuRefErrs'] = result || defaultObject;

    console.log("To return: ", toReturn);
    return toReturn;
  }

  private async checkSKUMatchConflictNew(sku, toReturn): Promise<any> {
    console.log(sku);
    var response = await this.restv2.getSkus(AndVsOr.OR, sku['skuname'], null, sku['skunumber'], null, null, null, 1);
    if (response.length == 0) {
      toReturn['new'].push(sku);
      return;
    }
    var responseSku = response[0];
    var match = true;
    console.log("SKU", sku);
    console.log("RESPONSESKU", responseSku);
    match = sku['skuname'] == responseSku['skuname']
      && sku['skunumber'] == responseSku['skunumber']
      && sku['caseupcnumber'] == responseSku['caseupcnumber']
      && sku['unitupcnumber'] == responseSku['unitupcnumber']
      && sku['unitsize'] == responseSku['unitsize']
      && sku['countpercase'] == responseSku['countpercase']
      && (sku['formula'] && (responseSku['formula'] != undefined))
      && sku['formula'] == responseSku['formula']['formulanumber']
      && sku['formulascalingfactor'] == responseSku['formulascalingfactor']
      && sku['manufacturingrate'] == responseSku['manufacturingrate']
      && sku['manufacturingsetupcost'] == responseSku['manufacturingsetupcost']
      && sku['manufacturingruncost'] == responseSku['manufacturingruncost']
      && sku['comment'] == responseSku['comment'];

    if (match) {
      toReturn['matches'].push(sku);
    } else {
      responseSku['Name'] = responseSku['skuname'];
      toReturn['conflicts'].push({
        old: [responseSku],
        new: sku,
        select: 'new'
      })
    }
  }

  private async checkSKUsMatchesConflictsNew(skus): Promise<any> {
    var toReturn = {};
    toReturn['matches'] = [];
    toReturn['conflicts'] = [];
    toReturn['new'] = [];
    //do processing here
    var numSKUsProcessed = 0;
    for (let sku of skus) {
      await this.checkSKUMatchConflictNew(sku, toReturn);
    }
    return toReturn;
  }

  private async checkIngredientsMatchesConflictsNew(ingredients): Promise<any> {
    var toReturn = {};
    toReturn['matches'] = [];
    toReturn['conflicts'] = [];
    toReturn['new'] = [];
    for (let ingredient of ingredients) {
      var response = await this.restv2.getIngredients(AndVsOr.OR, ingredient['ingredientname'], null, ingredient['ingredientnumber'], 1);
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
    }
    return toReturn;
  }

  private async checkProductLinesMatchesConflictsNew(productLines): Promise<any> {
    var toReturn = {};
    toReturn['matches'] = [];
    toReturn['conflicts'] = [];
    toReturn['new'] = [];
    for (let productLine of productLines) {
      var result = await this.restv2.getProductLines(AndVsOr.OR, productLine['Name'], null, 1);
      if (result.length == 0) {
        toReturn['new'].push(productLine);
      } else {
        toReturn['matches'].push(productLine);
      }
    }
    return toReturn;
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

  private async checkFormulaMatchConflictNew(formula, toReturn): Promise<any> {
    var response = await this.restv2.getFormulas(AndVsOr.OR, formula['formulaname'], null, formula['formulanumber'], null, null, 1);
    if (response.length == 0) {
      toReturn['new'].push(formula);
      return;
    }
    var responseFormula = response[0];
    var sameIngredientsAndQuantities = responseFormula['ingredientsandquantities'].length == formula['ingredientsandquantities'].length;
    for (var i = 0; i < formula['ingredientsandquantities'].length; i++) {
      if (!this.responseFormulaContainsIngredientAndQuantity(responseFormula, formula['ingredientsandquantities'][i]['ingredient'], formula['ingredientsandquantities'][i]['quantity'])) {
        sameIngredientsAndQuantities = false;
      }
    }
    if (responseFormula['formulaname'] == formula['formulaname']
      && responseFormula['formulanumber'] == formula['formulanumber']
      && responseFormula['comment'] == formula['comment']
      && sameIngredientsAndQuantities
    ) {
      toReturn['matches'].push(formula);
    } else {
      responseFormula['Name'] = responseFormula['formulaname'];
      toReturn['conflicts'].push({
        old: [responseFormula],
        new: formula,
        select: 'new'
      });
    }
    return toReturn;
  }

  private async checkFormulasMatchesConflictsNew(formulas): Promise<any> {
    var toReturn = {};
    toReturn['matches'] = [];
    toReturn['conflicts'] = [];
    toReturn['new'] = [];
    for (let formula of formulas) {
      this.checkFormulaMatchConflictNew(formula, toReturn);
    }
    return toReturn;
  }

  /**
   * Objects Formulas reference that could cause errors:
   * ingredients
   */
  allowedQuantities = ['oz', 'lb', 'ton', 'g', 'kg', 'floz', 'pt', 'qt', 'gal', 'mL', 'L', 'count'];
  private async checkFormulaReferences(formulas, ingredients): Promise<any> {
    var toReturn = {};
    toReturn['matches'] = [];
    toReturn['conflicts'] = [];
    toReturn['new'] = [];
    for (let formula of formulas) {
      for (let ingredientAndQuantity of formula['ingredientsandquantities']) {
        var ingredientnum = ingredientAndQuantity['ingredient'];
        if (!this.arrayContainsObjectWithKeyVal(ingredients, 'ingredientnumber', ingredientnum)) {
          var response = await this.restv2.getIngredients(AndVsOr.OR, null, null, ingredientnum, 1);
          if (response.length == 0) {
            throw Error("Could not find ingredient " + ingredientnum + " for formula " + formula['formulaname']);
          }
        }

        //if ingredientAndQuantity['quantity'] is one of the allowed quantities
        console.log((ingredientAndQuantity['quantity']+""));
        if (!this.allowedQuantities.includes((ingredientAndQuantity['quantity']+"").match('[a-zA-Z]+')[0])) {
          throw Error("Invalid formula unit of measure: " + ingredientAndQuantity['quantity']);
        }

      }
    }
    return toReturn;
  }

  private async checkSKUReference(sku, productLines, formulas): Promise<any> {
      var formulaResponse = await this.restv2.getFormulas(AndVsOr.OR, null, null, sku['formula'], null, null, 1);
      if (formulaResponse.length != 1 && !this.arrayContainsObjectWithKeyVal(formulas, 'formulanumber', sku['formula'])) {
        throw Error("Could not find formula " + sku['formula'] + " for SKU " + sku['skuname']);
      }
        
      for (let shortname of sku['manufacturinglines']) {
        var mlResponse = await this.restv2.getLine(AndVsOr.OR, null, null, shortname, null, 1);
        if (mlResponse.length != 1) {
          throw Error("Could not find Manufacturing Line " + shortname + " for SKU " + sku['skuname']);
        }
      }
  }

  /**
   * Objects SKUs reference that could cause errors:
   * Product Line
   * Formula
   */
  private async checkSKUReferences(skus, productLines, formulas): Promise<any> {
      var toReturn = {};
      toReturn['matches'] = [];
      toReturn['conflicts'] = [];
      toReturn['new'] = [];
      for (let sku of skus) {
        await this.checkSKUReference(sku, productLines, formulas);
      }
      return toReturn;
  }

}
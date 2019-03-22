import { Injectable } from '@angular/core';
import { RestServiceV2, AndVsOr } from '../restv2.service';

@Injectable({
  providedIn: 'root'
})
export class ImportUploadService {

  constructor(public restv2: RestServiceV2) { }

  async importData(data): Promise<void> {
    await this.importIngredients(data['ingredients']);
    console.log("finished ingredients.");
    await this.importFormulas(data['formulas']);
    console.log("finished formulas.");
    await this.importProductLines(data['productlines']);
    console.log("finished product lines.");
    await this.importSKUs(data['skus']);
    console.log("finished skus.");
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

  private async importIngredients(ingredients): Promise<void> {
    for (let conflict of ingredients['conflicts']) {
      if (conflict['select'] == 'new') {
        var ingredient = conflict['new'];
        var result = await this.restv2.modifyIngredient(AndVsOr.AND, conflict['old'][0]['ingredientname'], ingredient['ingredientname'], ingredient['ingredientnumber'], ingredient['vendorinformation'], ingredient['unitofmeasure'], ingredient['amount'], ingredient['costperpackage'], ingredient['comment']);
        if (result['ok'] != 1) {
          throw Error("Could not modify ingredient " + ingredient['ingredientname']);
        }
      }
    }
    for (let ingredient of ingredients['new']) {
      var result = await this.restv2.createIngredient(ingredient['ingredientname'], ingredient['ingredientnumber'], ingredient['vendorinformation'], ingredient['unitofmeasure'], ingredient['amount'], ingredient['costperpackage'], ingredient['comment']);
      if (result['ingredientname'] != ingredient['ingredientname']) {
        throw Error("Could not create ingredient " + ingredient['ingredientname']);
      }
    }
  }

  private async importFormula(formula): Promise<void> {
    var ingredientsAndQuantities = [];

    for (let ingredientAndQuantity of formula['ingredientsandquantities']) {
      var ingredientnum = ingredientAndQuantity['ingredient'];
      var response = await this.restv2.getIngredients(AndVsOr.AND, null, null, ingredientnum, 1);
      if (response.length == 0) {
        throw Error("Could not find ingredient " + ingredientnum + " for formula " + formula['formulaname']);
      }
      var ingredientID = response[0]['_id'];
      ingredientsAndQuantities.push({
        ingredient: "" + ingredientID,
        quantity: ingredientAndQuantity['quantity']
      });
    }

    var createResponse = await this.restv2.createFormula(formula['formulaname'], formula['formulanumber'], ingredientsAndQuantities, formula['comment'] || "");
    if (createResponse['formulaname'] != formula['formulaname']) {
      throw Error("Error creating formula.");
    }
  }

  private async updateFormula(oldname, formula): Promise<void> {
    var ingredientsAndQuantities = [];

    for (let ingredientAndQuantity of formula['ingredientsandquantities']) {
      var ingredientnum = ingredientAndQuantity['ingredient'];
      var response = await this.restv2.getIngredients(AndVsOr.AND, null, null, ingredientnum, 1);
      if (response.length == 0) {
        throw Error("Could not find ingredient " + ingredientnum + " for formula " + formula['formulaname']);
      }
      var ingredientID = response[0]['_id'];
      ingredientsAndQuantities.push({
        ingredient: "" + ingredientID,
        quantity: ingredientAndQuantity['quantity']
      });
    }

    var modifyResponse = await this.restv2.modifyFormula(AndVsOr.AND, oldname, formula['formulaname'], formula['formulanumber'], ingredientsAndQuantities, formula['comment'] || "");
    if (modifyResponse['ok'] == 1) {
      throw Error("Error creating formula.");
    }
  }

  private async importFormulas(formulas): Promise<void> {
    for (let formula of formulas['new']) {
      await this.importFormula(formula);
    }
    for (let conflict of formulas['conflicts']) {
      if (conflict['select'] == 'new') {
        await this.updateFormula(conflict['old'][0]['formulaname'], conflict['new']);
      }
    }
  }

  private async importSKU(sku): Promise<void> {
    var formulas = await this.restv2.getFormulas(AndVsOr.AND, null, null, sku['formula'], null, null, 1);
    if (formulas.length == 0) {
      throw Error("Could not get formula " + sku['formula'] + " for SKU " + sku['skuname']);
    }
    var createSkuResponse = await this.restv2.createSku(sku['skuname'], sku['skunumber'], sku['caseupcnumber'], sku['unitupcnumber'], "" + sku['unitsize'], sku['countpercase'], formulas[0]['_id'], sku['formulascalingfactor'], sku['manufacturingrate'], sku['manufacturingsetupcost'], sku['manufacturingruncost'], sku['comment']);
    if (createSkuResponse['skuname'] != sku['skuname']) {
      throw Error("Could not create SKU " + sku['skuname']);
    }

    var getPLResponse = await this.restv2.getProductLines(AndVsOr.AND, sku['productline'], name, 1);
    if (getPLResponse.length == 0) {
      throw Error("Could not find product line " + sku['productline'] + " for SKU " + sku['skuname']);
    }
    var skus = getPLResponse[0]['skus'];
    skus.push({
      sku: createSkuResponse['_id']
    });
    console.log("SKU: ",sku);
    var modifyPLResponse = await this.restv2.modifyProductLine(AndVsOr.AND, sku['productline'], sku['productline'], skus);
    if (modifyPLResponse['ok'] != 1) {
      throw Error("Could not modify Product Line " + sku['productline'] + " for SKU " + sku['skuname']);
    }

    for (let ml of sku['manufacturinglines']) {
      var mlResponse = await this.restv2.getLine(AndVsOr.OR, null, null, ml, null, 1);
      if (mlResponse.length == 0) {
        throw Error("Could not find manufacturing line " + ml + " for SKU " + sku['skuname']);
      }
      var containsSKU = false;
      for (let currentSKU of mlResponse[0]['skus']) {
        if (currentSKU['skuname'] == sku['skuname']) {
          containsSKU = true;
        }
      }
      if (!containsSKU) {
        mlResponse[0]['skus'].push({
          sku: createSkuResponse['_id']
        });
        var mlCreateResponse = await this.restv2.modifyLine(AndVsOr.AND, mlResponse[0]['linename'], mlResponse[0]['linename'], mlResponse[0]['shortname'], mlResponse[0]['skus'], mlResponse[0]['comment']);
        console.log("ML Response: ",mlResponse);
        console.log("ML Create Response: ",mlCreateResponse);
        if (mlCreateResponse['ok'] != 1 || mlCreateResponse['nModified'] != 1) {
          throw Error("Could not add SKU " + sku['skuname'] + " to Manufacturing Line " + mlCreateResponse['linename']);
        }
      }
    }
  }

  private async updateSKU(oldsku, newsku): Promise<void> {
    var formulas = await this.restv2.getFormulas(AndVsOr.AND, null, null, newsku['formula'], null, null, 1);
    if (formulas.length == 0) {
      throw Error("Could not get formula " + newsku['formula'] + " for SKU " + newsku['skuname']);
    }
    var response = await this.restv2.modifySku(AndVsOr.AND, oldsku['skuname'], newsku['skuname'], newsku['skunumber'], newsku['caseupcnumber'], newsku['unitupcnumber'], "" + newsku['unitsize'], newsku['countpercase'], formulas[0]['_id'], newsku['formulascalingfactor'], newsku['manufacturingrate'], newsku['manufacturingsetupcost'], newsku['manufacturingruncost'], newsku['comment']);
    console.log("Reponse: ", response);
    if (response['ok'] != 1) {
      throw Error("Could not update sku " + oldsku['skuname']);
    }
  }

  private async importNewSKUs(newSKUs, index): Promise<void> {
    await this.importSKU(newSKUs[index]);
    if (!(index >= newSKUs.length - 1)) {
      await this.importNewSKUs(newSKUs, index + 1);
    }
  }

  private async updateSKUs(skus, index): Promise<void> {
    await this.updateSKU(skus[index]['old'][0], skus[index]['new']);
    if (!(index >= skus.length - 1)) {
      await this.updateSKUs(skus, index + 1);
    }
  }

  private async importSKUs(skus): Promise<void> {
    //the problem here is that all of the updates are occurring at the same time so there is a race condition where both SKUs obtain the product line before either SKU updates it.
    //Fix: enforce that they upload sequentially
    if (skus['new'].length > 0) {
      await this.importNewSKUs(skus['new'], 0);
    }
    var conflictsToUpdate = skus['conflicts'].filter((value, index, array) => {
      return value['select'] == 'new';
    });
    if (conflictsToUpdate.length > 0) {
      await this.updateSKUs(conflictsToUpdate, 0);
    }
  }

  private async importProductLines(productLines): Promise<void> {
    for (let productLine of productLines['new']) {
      var result = await this.restv2.createProductLine(productLine['Name'], []);
      if (result['productlinename'] != productLine['Name']) {
        throw Error("Could not create product line " + result['productlinename']);
      }
    }
  }

}

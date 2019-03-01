import { Injectable } from '@angular/core';
import { RestService } from '../rest.service';

@Injectable({
  providedIn: 'root'
})
export class ImportUploadService {

  constructor(public rest: RestService) { }

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
        var result = await this.rest.modifyIngredient(conflict['old'][0]['ingredientname'], ingredient['ingredientname'], ingredient['ingredientnumber'], ingredient['vendorinformation'], ingredient['unitofmeasure'], ingredient['amount'], ingredient['costperpackage'], ingredient['comment']).toPromise();
        if (result['ok'] != 1) {
          throw Error("Could not modify ingredient " + ingredient['ingredientname']);
        }
      }
    }
    for (let ingredient of ingredients['new']) {
      var result = await this.rest.createIngredient(ingredient['ingredientname'], ingredient['ingredientnumber'], ingredient['vendorinformation'], ingredient['unitofmeasure'], ingredient['amount'], ingredient['costperpackage'], ingredient['comment']).toPromise();
      if (result['ingredientname'] != ingredient['ingredientname']) {
        throw Error("Could not create ingredient " + ingredient['ingredientname']);
      }
    }
  }

  private async importFormula(formula): Promise<void> {
    var ingredientsAndQuantities = [];

    for (let ingredientAndQuantity of formula['ingredientsandquantities']) {
      var ingredientnum = ingredientAndQuantity['ingredient'];
      var response = await this.rest.getIngredients("", "", ingredientnum, 1).toPromise();
      if (response.length == 0) {
        throw Error("Could not find ingredient " + ingredientnum + " for formula " + formula['formulaname']);
      }
      var ingredientID = response[0]['_id'];
      ingredientsAndQuantities.push({
        ingredient: "" + ingredientID,
        quantity: ingredientAndQuantity['quantity']
      });
    }

    var createResponse = await this.rest.createFormula(formula['formulaname'], formula['formulanumber'], ingredientsAndQuantities, formula['comment'] || "").toPromise();
    if (createResponse['formulaname'] != formula['formulaname']) {
      throw Error("Error creating formula.");
    }
  }

  private async updateFormula(oldname, formula): Promise<void> {
    var ingredientsAndQuantities = [];

    for (let ingredientAndQuantity of formula['ingredientsandquantities']) {
      var ingredientnum = ingredientAndQuantity['ingredient'];
      var response = await this.rest.getIngredients("", "", ingredientnum, 1).toPromise();
      if (response.length == 0) {
        throw Error("Could not find ingredient " + ingredientnum + " for formula " + formula['formulaname']);
      }
      var ingredientID = response[0]['_id'];
      ingredientsAndQuantities.push({
        ingredient: "" + ingredientID,
        quantity: ingredientAndQuantity['quantity']
      });
    }

    var modifyResponse = await this.rest.modifyFormula(oldname, formula['formulaname'], formula['formulanumber'], ingredientsAndQuantities, formula['comment'] || "").toPromise();
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
    var createSkuResponse = await this.rest.createSku(sku['skuname'], sku['skunumber'], sku['caseupcnumber'], sku['unitupcnumber'], "" + sku['unitsize'], sku['countpercase'], sku['formula'], sku['formulascalingfactor'], sku['manufacturingrate'], sku['comment']).toPromise();
    if (createSkuResponse['skuname'] != sku['skuname']) {
      throw Error("Could not create SKU " + sku['skuname']);
    }

    var getPLResponse = await this.rest.getProductLines(sku['productline'], "", 1).toPromise();
    if (getPLResponse.length == 0) {
      throw Error("Could not find product line " + sku['productline'] + " for SKU " + sku['skuname']);
    }
    var skus = getPLResponse[0]['skus'];
    skus.push({
      sku: createSkuResponse['_id']
    });
    var modifyPLResponse = await this.rest.modifyProductLine(sku['productline'], sku['productline'], skus).toPromise();
    if (modifyPLResponse['ok'] != 1) {
      throw Error("Could not modify Product Line " + sku['productline'] + " for SKU " + sku['skuname']);
    }

    for (let ml of sku['manufacturinglines']) {
      var mlResponse = await this.rest.getLine(ml, "$a", ml, "", 1).toPromise();
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
        var mlCreateResponse = await this.rest.modifyLine(mlResponse[0]['linename'], mlResponse[0]['linename'], mlResponse[0]['shortname'], mlResponse[0]['skus'], mlResponse[0]['comment']).toPromise();
        if (mlCreateResponse['linename'] != mlResponse[0]['linename']) {
          throw Error("Could not add SKU " + sku['skuname'] + " to Manufacturing Line " + mlCreateResponse['linename']);
        }
      }
    }
  }

  private async updateSKU(oldsku, newsku): Promise<void> {
    var formulas = await this.rest.getFormulas("", newsku['formula'], 0, 1).toPromise();
    if (formulas.length == 0) {
      throw Error("Could not get formula " + newsku['formula'] + " for SKU " + newsku['skuname']);
    }
    var response = await this.rest.modifySku(oldsku['skuname'], newsku['skuname'], newsku['skunumber'], newsku['caseupcnumber'], newsku['unitupcnumber'], "" + newsku['unitsize'], newsku['countpercase'], newsku['formula'], newsku['formulascalingfactor'], newsku['manufacturingrate'], newsku['comment']).toPromise();
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
      var result = await this.rest.createProductLine(productLine['Name'], []).toPromise();
      if (result['productlinename'] != productLine['Name']) {
        throw Error("Could not create product line " + result['productlinename']);
      }
    }
  }

}

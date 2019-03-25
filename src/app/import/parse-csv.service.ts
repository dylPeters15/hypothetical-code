import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RestServiceV2, AndVsOr } from '../restv2.service';

@Injectable({
  providedIn: 'root'
})
export class ParseCsvService {

  constructor(private papa: Papa, public restv2: RestServiceV2) { }

  async parseCSVFiles(files: { [key: string]: File }): Promise<any> {
    return new Promise((resolve, reject) => {
      var filesAsArray: File[] = [];
      for (let key in files) {
        if (!isNaN(parseInt(key))) {
          filesAsArray.push(files[key]);
        }
      }

      var filesWithText = {};
      var numFilesRead = 0;
      for (var i = 0; i < filesAsArray.length; i = i + 1) {
        let file = filesAsArray[i];
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          let result: string = fileReader.result.toString();
          filesWithText[file.name] = result;
          numFilesRead = numFilesRead + 1;
          if (numFilesRead == filesAsArray.length) {
            this.parseFilesWithNames(filesWithText).then(async result => {
              var objectToReturn = {};
              objectToReturn['skus'] = [];
              objectToReturn['ingredients'] = [];
              objectToReturn['formulas'] = [];
              objectToReturn['productlines'] = [];
              for (let filename in result) {
                if (filename.startsWith("skus")) {
                  objectToReturn['skus'] = objectToReturn['skus'].concat(this.parseSKUs(result[filename]));
                } else if (filename.startsWith("ingredients")) {
                  objectToReturn['ingredients'] = objectToReturn['ingredients'].concat(this.parseIngredients(result[filename]));
                } else if (filename.startsWith("formulas")) {
                  objectToReturn['formulas'] = objectToReturn['formulas'].concat(await this.consolidateFormulas(result[filename]));
                } else if (filename.startsWith("product_lines")) {
                  objectToReturn['productlines'] = objectToReturn['productlines'].concat(result[filename]);
                } else {
                  reject(Error("Filename incorrect."));
                }
              }
              await this.convertFormulaUnitsOfMeasure(objectToReturn['formulas'], objectToReturn['ingredients']);
              resolve(objectToReturn);
            }).catch(err => {
              reject(err);
            });
          }
        }
        fileReader.readAsText(file);
      }
    });
  }

  private parseFilesWithNames(filesWithNames: { [fileName: string]: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      //check filenames
      var numFiles = 0;
      for (let fileName in filesWithNames) {
        var validFileBeginning = fileName.startsWith("skus")
          || fileName.startsWith("ingredients")
          || fileName.startsWith("product_lines")
          || fileName.startsWith("formulas");
        var validFileEnd = fileName.endsWith(".csv");
        if (!validFileBeginning) {
          reject(Error("File name must start with 'skus', 'ingredients', 'product_lines', or 'formulas'."));
        }
        if (!validFileEnd) {
          reject(Error("File name must end with '.csv'."));
        }
        numFiles = numFiles + 1;
      }

      var objectToReturn = {};
      var numParsed = 0;
      for (let fileName in filesWithNames) {

        this.papa.parse(filesWithNames[fileName],
          {
            delimiter: ',',
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (result) => {
              if (result.errors.length != 0) {
                reject(result.errors[0]);
              }
              let objectArray: any[] = result.data;
              // objectArray.shift(); //remove header
              objectToReturn[fileName] = objectArray;
              numParsed = numParsed + 1;
              if (numParsed == numFiles) {
                resolve(objectToReturn);
              }
            }
          });
      }
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

  private arrayObjectWithKeyVal(array: any[], key: string, val: string): any {
    for (var i = 0; i < array.length; i++) {
      if (Object.keys(array[i]).includes(key) && array[i][key] == val) {
        return array[i];
      }
    }
    return null;
  }

  private parseSKUs(skusObject): any[] {
    var objectToReturn = [];
    for (var i = 0; i < skusObject.length; i++) {
      var currentSKU = skusObject[i];
      var newSKU = {};
      newSKU['skuname'] = currentSKU['Name'];
      newSKU['skunumber'] = this.getNumber(currentSKU['SKU#']);
      newSKU['caseupcnumber'] = this.getNumber(currentSKU['Case UPC']);
      newSKU['unitupcnumber'] = this.getNumber(currentSKU['Unit UPC']);
      newSKU['unitsize'] = currentSKU['Unit size'];
      newSKU['countpercase'] = this.getNumber(currentSKU['Count per case']);
      newSKU['productline'] = currentSKU['PL Name'];
      newSKU['formula'] = this.getNumber(currentSKU['Formula#']);
      newSKU['formulascalingfactor'] = this.getNumber(currentSKU['Formula factor']);
      newSKU['manufacturingrate'] = this.getNumber(currentSKU['Rate']);
      newSKU['comment'] = currentSKU['Comment'] || "";
      newSKU['manufacturinglines'] = currentSKU["ML Shortnames"] ? currentSKU["ML Shortnames"].split(",") : [];
      newSKU['manufacturingsetupcost'] = this.getNumber(currentSKU['Mfg setup cost']);
      newSKU['manufacturingruncost'] = this.getNumber(currentSKU['Mfg run cost']);
      objectToReturn.push(newSKU);
    }
    return objectToReturn;
  }

  private consolidateFormulas(formulasObject): any[] {
    var objectToReturn = [];

    for (var i = 0; i < formulasObject.length; i++) {
      var currentFormula = formulasObject[i];
      var newFormula = {};//this.arrayObjectWithKey(objectToReturn,currentFormula['Name'])||{};
      if (this.arrayContainsObjectWithKeyVal(objectToReturn, 'formulaname', currentFormula['Name'])) {
        newFormula = this.arrayObjectWithKeyVal(objectToReturn, 'formulaname', currentFormula['Name']);
      } else {
        newFormula['formulaname'] = currentFormula['Name'];
        newFormula['formulanumber'] = this.getNumber(currentFormula['Formula#']);
        newFormula['ingredientsandquantities'] = [];
        newFormula['comment'] = currentFormula['Comment'] || "";
        objectToReturn.push(newFormula);
      }
      newFormula['ingredientsandquantities'].push({
        ingredient: this.getNumber(currentFormula['Ingr#']),
        quantity: currentFormula['Quantity']
      });
    }

    return objectToReturn;
  }






















  allowedQuantities = ['oz', 'lb', 'ton', 'g', 'kg', 'floz', 'pt', 'qt', 'gal', 'ml', 'l', 'count'];
  abreviations = {
    oz: 'oz',
    ounce: 'oz',

    lb: 'lb',
    pound: 'pound',

    ton: 'ton',

    g: 'g',
    gram: 'g',

    kg: 'kg',
    kilogram: 'kg',

    floz: 'floz',
    fluidounce: 'floz',

    pt: 'pt',
    pint: 'pt',

    qt: 'qt',
    quart: 'qt',

    gal: 'gal',
    gallon: 'gal',

    ml: 'ml',
    milliliter: 'ml',

    l: 'l',
    liter: 'l',

    ct: 'ct',
    count: 'ct'
  };
  conversions = {
    'oz/oz': 1 / 1,
    'oz/lb': 16 / 1,
    'oz/ton': 32000 / 1,
    'oz/g': 1 / 28.3495,
    'oz/kg': 35.274 / 1,

    'lb/oz': 1 / 16,
    'lb/lb': 1 / 1,
    'lb/ton': 32000 / 1,
    'lb/g': 1 / 453.592,
    'lb/kg': 1 / 0.453592,

    'ton/oz': 1 / 32000,
    'ton/lb': 1 / 2000,
    'ton/ton': 1 / 1,
    'ton/g': 1 / 907185,
    'ton/kg': 1 / 907.185,

    'g/oz': 28.3495 / 1,
    'g/lb': 453.592 / 1,
    'g/ton': 32000 / 1,
    'g/g': 1 / 1,
    'g/kg': 1000 / 1,

    'kg/oz': 1 / 35.274,
    'kg/lb': 0.453592 / 1,
    'kg/ton': 907.185 / 1,
    'kg/g': 1 / 1000,
    'kg/kg': 1 / 1,

    'floz/floz': 1 / 1,
    'floz/pt': 16 / 1,
    'floz/qt': 32 / 1,
    'floz/gal': 128 / 1,
    'floz/ml': 29.5735 / 1,
    'floz/l': 33.814 / 1,

    'pt/floz': 1 / 16,
    'pt/pt': 1 / 1,
    'pt/qt': 2 / 1,
    'pt/gal': 8 / 1,
    'pt/ml': 1 / 473.176,
    'pt/l': 2.11338 / 1,

    'qt/floz': 1 / 32,
    'qt/pt': 1 / 16,
    'qt/qt': 1 / 1,
    'qt/gal': 4 / 1,
    'qt/ml': 1 / 946.353,
    'qt/l': 1 / 0.946353,

    'gal/floz': 1 / 128,
    'gal/pt': 1 / 8,
    'gal/qt': 1 / 4,
    'gal/gal': 1 / 1,
    'gal/ml': 1 / 3785.41,
    'gal/l': 1 / 3.78541,

    'ml/floz': 1 / 29.5735,
    'ml/pt': 473.176 / 1,
    'ml/qt': 946.353 / 1,
    'ml/gal': 3785.41 / 1,
    'ml/ml': 1 / 1,
    'ml/l': 1000 / 1,

    'l/floz': 1 / 33.814,
    'l/pt': 1 / 2.11338,
    'l/qt': 0.946353 / 1,
    'l/gal': 3.78541 / 1,
    'l/ml': 1 / 1000,
    'l/l': 1 / 1,

    'ct/ct': 1 / 1
  }
  private getUnitOfMeasure(inputString) {
    var unit = (inputString + "").toLowerCase().match('[a-zA-Z]+')[0];
    if (unit.charAt(unit.length - 1) == "s") {
      unit = unit.slice(0, -1)
    }
    var abbreviation = this.abreviations[unit];
    if (abbreviation) {
      return abbreviation;
    }
    throw Error("Invalid formula unit of measure: " + inputString);
  }
  private async convertFormulaUnitsOfMeasure(formulas, ingredients): Promise<void> {
    for (var i = 0; i < formulas.length; i++) {
      var formula = formulas[i];
      for (var j = 0; j < formula['ingredientsandquantities'].length; j++) {
        var ingredientAndQuantity = formula['ingredientsandquantities'][j];

        //check for ingredient in database
        var ingredientsInDatabase = await this.restv2.getIngredients(AndVsOr.AND, null, null, ingredientAndQuantity['ingredient'], 1);
        var ingredient;
        if (ingredientsInDatabase.length == 1) {
          ingredient = ingredientsInDatabase[0];
        } else {
          for (var k = 0; k < ingredients.length; k++) {
            if (ingredients[k]['ingredientnumber'] == ingredientAndQuantity['ingredient']) {
              ingredient = ingredients[k];
            }
          }
        }

        ingredientAndQuantity['quantity'] = this.convertQuantity(ingredientAndQuantity['quantity'], ingredient);
      }
    }
  }
  private convertQuantity(quantityString: string, ingredient: any): Number {
    //convert from the given unit to the ingredient's unit here
    console.log(this.conversions);
    var formulaUnitOfMeasure = this.getUnitOfMeasure(quantityString);
    var ingredientUnitOfMeasure = this.getUnitOfMeasure(ingredient['unitofmeasure']);
    console.log("Formula unit of measure: ", formulaUnitOfMeasure);
    console.log("Ingredient unit of measure: ", ingredientUnitOfMeasure);

    //convert formula quantities to be in the same unit of measure as the ingredients
    var formulaQuantity = this.getNumber(quantityString);
    var formulaQuantityInIngredientUnitOfMeasure = formulaQuantity * this.conversions[ingredientUnitOfMeasure + "/" + formulaUnitOfMeasure];

    console.log(formulaQuantity);
    console.log(this.conversions[ingredientUnitOfMeasure + "/" + formulaUnitOfMeasure]);
    console.log(formulaQuantityInIngredientUnitOfMeasure);
    console.log(ingredient['amount']);

    var numCasesOfIngredient = formulaQuantityInIngredientUnitOfMeasure / ingredient['amount'];

    //temporary
    if (isNaN(numCasesOfIngredient)) {
      return 0;
    }

    return numCasesOfIngredient;
  }

  private parseIngredients(ingredientsObject): any[] {
    var objectToReturn = [];
    for (var i = 0; i < ingredientsObject.length; i++) {
      var currentIngredient = ingredientsObject[i];
      var newIngredient = {};

      newIngredient['ingredientname'] = currentIngredient['Name'];
      newIngredient['ingredientnumber'] = this.getNumber(currentIngredient['Ingr#']);
      newIngredient['vendorinformation'] = currentIngredient['Vendor Info'];
      newIngredient['unitofmeasure'] = currentIngredient['Size'].toLowerCase().match('[a-z]+')[0];
      newIngredient['amount'] = this.getNumber(currentIngredient['Size']);
      newIngredient['costperpackage'] = this.getNumber(currentIngredient['Cost']);
      newIngredient['comment'] = currentIngredient['Comment'] || "";

      objectToReturn.push(newIngredient);
    }
    return objectToReturn;
  }

  private getNumber(stringIn: any) {
    return typeof stringIn == "string" ? Number(stringIn.match('[0-9\.]+')[0]) : stringIn;
  }

}

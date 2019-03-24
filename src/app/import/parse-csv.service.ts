import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root'
})
export class ParseCsvService {

  constructor(private papa: Papa) { }

  parseCSVFiles(files: { [key: string]: File }): Promise<any> {
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
            this.parseFilesWithNames(filesWithText).then(result => {
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
                  objectToReturn['formulas'] = objectToReturn['formulas'].concat(this.consolidateFormulas(result[filename]));
                } else if (filename.startsWith("product_lines")) {
                  objectToReturn['productlines'] = objectToReturn['productlines'].concat(result[filename]);
                } else {
                  reject(Error("Filename incorrect."));
                }
              }
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
      newSKU['comment'] = currentSKU['Comment']||"";
      newSKU['manufacturinglines'] = currentSKU["ML Shortnames"]?currentSKU["ML Shortnames"].split(","):[];
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
        newFormula['comment'] = currentFormula['Comment']||"";
        objectToReturn.push(newFormula);
      }
      newFormula['ingredientsandquantities'].push({
        ingredient: this.getNumber(currentFormula['Ingr#']),
        quantity: currentFormula['Quantity']
      });
    }

    return objectToReturn;
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
      newIngredient['comment'] = currentIngredient['Comment']||"";

      objectToReturn.push(newIngredient);
    }
    return objectToReturn;
  }

  private getNumber(stringIn: any) {
    return typeof stringIn == "string"?Number(stringIn.match('[0-9\.]+')[0]):stringIn;
  }

}

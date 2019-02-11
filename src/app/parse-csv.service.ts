import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root'
})
export class ParseCsvService {

  constructor(private papa: Papa) { }

  parseCSVFile(files: { [key: string]: File }): Promise<any> {
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
                  objectToReturn['skus'] = objectToReturn['skus'].concat(result[filename])
                } else if (filename.startsWith("ingredients")) {
                  objectToReturn['ingredients'] = objectToReturn['ingredients'].concat(result[filename])
                } else if (filename.startsWith("formulas")) {
                  objectToReturn['formulas'] = objectToReturn['formulas'].concat(result[filename])
                } else if (filename.startsWith("product_lines")) {
                  objectToReturn['productlines'] = objectToReturn['productlines'].concat(result[filename])
                } else {
                  reject(Error("Filename incorrect."));
                }
              }
              console.log(objectToReturn);
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

  /**
  * Return value:
  * {
  *    <filename1> : [
  *        {object from line 1},
  *        {object from line 2},
  *        ...
  *    ],
  *    <filename1> : [
  *        {object from line 1},
  *        {object from line 2},
  *        ...
  *    ],
  *    ...
  * }
  * @param filesAsArray 
  */
  parseFilesWithNames(filesWithNames: { [fileName: string]: string }): Promise<any> {
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
          reject(Error("Error. File name must start with 'skus', 'ingredients', 'product_lines', or 'formulas'."));
        }
        if (!validFileEnd) {
          reject(Error("Error. File name must end with '.csv'."));
        }
        numFiles = numFiles + 1;
      }

      var objectToReturn = {};
      var numParsed = 0;
      for (let fileName in filesWithNames) {

        this.papa.parse(filesWithNames[fileName],
          {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (result) => {
              console.log(result);
              if (result.errors.length != 0) {
                reject(result.errors[0]);
              }
              let objectArray = result.data;
              // if (fileName.endsWith(".csv")) {
              //   if (fileName.startsWith("skus")) {
              //     objectArray = this.parseSKUs(result);
              //   } else if (fileName.startsWith("ingredients")) {
              //     objectArray = this.parseIngredients(result);
              //   } else if (fileName.startsWith("product_lines")) {
              //     objectArray = this.parseProductLines(result);
              //   } else if (fileName.startsWith("formulas")) {
              //     objectArray = this.parseFormulas(result);
              //   } else {
              //     throw Error("Error. File name must start with 'skus', 'ingredients', 'product_lines', or 'formulas'.");
              //   }
              // } else {
              //   throw Error("Error. File name must end with '.csv'.");
              // }
              objectToReturn[fileName] = objectArray;
              numParsed = numParsed + 1;
              if (numParsed == numFiles) {
                console.log(objectToReturn);
                resolve(objectToReturn);
              }
            }
          });
      }
    });
  }

  // private parseSKUs(result): any[] {

  // }

  // private parseIngredients(result): any[] {

  // }

  // private parseFormulas(result): any[] {

  // }

  // private parseProductLines(result): any[] {

  // }


  // private parseFiles(filesAsArray: File[]) {
  //   var parsedFiles = {};
  //   for (var i = 0; i < filesAsArray.length; i = i + 1) {
  //     var file: File = filesAsArray[i];
  //     parsedFiles[file.name] = this.parseFile(file);
  //   }
  //   return parsedFiles;
  // }

  // private parseFile(file) {
  //   console.log(file);
  //   if (file.name.endsWith(".csv")) {
  //     if (file.name.startsWith("skus")) {

  //     } else if (file.name.startsWith("ingredients")) {

  //     } else if (file.name.startsWith("product_lines")) {

  //     } else if (file.name.startsWith("formulas")) {

  //     } else {
  //       throw Error("Error. File name must start with 'skus', 'ingredients', 'product_lines', or 'formulas'.");
  //     }
  //   } else {
  //     throw Error("Error. File name must end with '.csv'.");
  //   }
  // }
}

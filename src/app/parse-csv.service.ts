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
            resolve(this.parseFilesWithNames(filesWithText));
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
  parseFilesWithNames(filesWithNames: { [fileName: string]: string }): any {
    console.log(filesWithNames);
    for (let fileName in filesWithNames) {
      console.log("Filename: ", fileName);
      console.log(filesWithNames[fileName]);
      // _.parse(filesWithNames[fileName],{});
      // console.log(csvparse(filesWithNames[fileName]));
      this.papa.parse(filesWithNames[fileName],{
        complete: (result) => {
            console.log('Parsed: ', result);
        }
    });
    }
  }

 
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

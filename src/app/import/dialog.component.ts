import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RestService } from '../rest.service';
import { MatSnackBar } from '@angular/material';
import { fillProperties } from '@angular/core/src/util/property';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @ViewChild('fileSelector') fileSelector;

  public fileObject: File;

  constructor(public dialogRef: MatDialogRef<DialogComponent>, public rest: RestService, private snackBar: MatSnackBar) { }

  ngOnInit() { }

  progress;

  onFilesAdded() {
    const files: { [key: string]: File } = this.fileSelector.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.fileObject = files[key];
      }
    }
  }

  addFiles() {
    this.fileSelector.nativeElement.click();
  }

  closeDialog() {
    this.upload();
  }

  getFileAsString(callback, objectref) {

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      var result = JSON.stringify(fileReader.result)
      result = result.substring(1, result.length - 1);
      callback(result, objectref);
    }
    fileReader.readAsText(this.fileObject);

  }

  parseSKUs(text, objectref) {
    var responses = [];
    var splitByLine = text.split("\\n");

    var numNonEmptyLines = 0;

    for (let myline in splitByLine) {
      if (splitByLine[myline] != "") {
        console.log(splitByLine[myline]);
        numNonEmptyLines = numNonEmptyLines + 1;
      }
    }

    for (var i = 0; i < splitByLine.length; i = i+1) {
      if (splitByLine[i] != "") {
        console.log(splitByLine[i]);
        let splitByCommas = splitByLine[i].split(",");

        let sku = {
          name: splitByCommas[1],
          skuNumber: parseInt(splitByCommas[0]),
          caseUpcNumber: splitByCommas[2],
          unitUpcNumber: splitByCommas[3],
          unitSize: splitByCommas[4], 
          countPerCase: parseInt(splitByCommas[5]),
          productLine: splitByCommas[6],
          ingredientTuples: [],
          comment: splitByCommas[7],
          id: objectref.rest.generateId()
        };

        objectref.rest.checkForSkuCollision(sku).subscribe(response => {
          console.log(response);
          if (response['errormessage']) {
            this.snackBar.open("Error creating records. Please refresh and try again.", "close");
            return;
          }
          var results = response['results'];

          console.log(results);
          console.log(sku);

          if (results.name == sku.name 
            && results.skuNumber == sku.skuNumber 
            && results.caseUpcNumber == sku.caseUpcNumber
            && results.unitUpcNumber == sku.unitUpcNumber
            && results.unitSize == sku.unitSize
            && results.countPerCase == sku.countPerCase
            && results.productLine == sku.productLine
            && results.comment == sku.comment) {
            console.log("SKU match. Do nothing.");
          } else if (results.name == sku.name 
            || results.skuNumber == sku.skuNumber 
            || results.caseUpcNumber == sku.caseUpcNumber
            || results.unitUpcNumber == sku.unitUpcNumber
            || results.id == sku.id) {
            console.log("Collision. Prompt user.");
          } else {
            console.log("New SKU.");
            objectref.rest.adminCreateSku(sku.name, sku.skuNumber, sku.caseUpcNumber, sku.unitUpcNumber, sku.unitSize, sku.countPerCase, sku.productLine, "", sku.comment, sku.id).subscribe(response => {
              console.log("Sku create response: " + JSON.stringify(response));
            })
          }

        });

        // objectref.rest.adminCreateSku(firsthalfsplit[0], firsthalfsplit[1], firsthalfsplit[2], firsthalfsplit[3], firsthalfsplit[4], firsthalfsplit[5], firsthalfsplit[6], splitbyquotes[1], secondhalfsplit[1], objectref.rest.generateId()).subscribe(response => {
        //   responses.push(response);
        //   if (responses.length == numNonEmptyLines) {
        //     objectref.parseResponses(responses);
        //   }
        // });
      }

    }


  }

  parseIngredients(text, objectref) {

  }

  parseProductLines(text, objectref) {

  }

  parseFormulas(text, objectref) {

  }

  upload() {
    if (this.fileObject.name.endsWith(".csv")) {
      if (this.fileObject.name.startsWith("skus")) {
        this.getFileAsString(this.parseSKUs, this);
      } else if (this.fileObject.name.startsWith("ingredients")) {
        this.getFileAsString(this.parseIngredients, this);
      } else if (this.fileObject.name.startsWith("product_lines")) {
        this.getFileAsString(this.parseProductLines, this);
      } else if (this.fileObject.name.startsWith("formulas")) {
        this.getFileAsString(this.parseFormulas, this);
      } else {
        this.snackBar.open("Error. File name must start with 'skus', 'ingredients', 'product_lines', or 'formulas'.", "close");
      }
    } else {
      this.snackBar.open("Error. File name must end with '.csv'.", "close");
    }
    this.dialogRef.close();
  }

  parseResponses(responses: any): void {
    console.log("Responses: " + JSON.stringify(responses));
    var allResponsesSuccess = true;
    for (var i = 0; i < responses.length; i = i + 1) {
      var response = responses[i];
      if (!response['success']) {
        allResponsesSuccess = false;
      }
    }
    if (allResponsesSuccess) {
      this.snackBar.open("Successfully created " + responses.length + " records.", "close");
    } else {
      this.snackBar.open("Error creating records. Please refresh and try again.", "close");
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RestService } from '../rest.service';
import { ParseCsvService } from '../parse-csv.service';
import { ImportMatchConflictNewCheckerService } from '../import-match-conflict-new-checker.service';
import { ImportPreviewDialogComponent } from '../import-preview-dialog/import-preview-dialog.component';
import { reject } from 'q';

@Component({
  selector: 'app-upload',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent  implements OnInit {
  @ViewChild('fileSelector') fileSelector;
  @ViewChild('fileSelectorForm') fileSelectorForm;

  constructor(private parser: ParseCsvService, private importChecker: ImportMatchConflictNewCheckerService, public dialog: MatDialog, public rest:RestService) {}

  openFileSelector() {
    this.fileSelector.nativeElement.click();
  }

  ngOnInit() {

  }

  filesSelected() {
    this.parser.parseCSVFiles(this.fileSelector.nativeElement.files).then(csvResult => {
      this.fileSelectorForm.nativeElement.reset();
      console.log(csvResult);
      this.importChecker.checkAll(csvResult).then(checkResult => {
        console.log(checkResult);
        
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = checkResult;
        this.dialog.open(ImportPreviewDialogComponent, dialogConfig).afterClosed().subscribe(closeData => {
          console.log(closeData);
          if (!closeData || closeData['cancel']) {
            //operation was cancelled
            console.log("Operation cancelled");
          } else {
            //operation confirmed
            console.log("Operation confirmed.");
            this.importData(closeData);
          }
        });

      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  importData(data): void {
    new Promise((resolve, reject) => {
      function resolution(result){
        if (result) {
          numCompleted = numCompleted + 1;
          if (numCompleted == totalNum) {
            resolve(true);
          }
        } else {
          reject(result);
        }
      };
      function catcher(err){
        reject(err);
      };
      var numCompleted = 0;
      var totalNum = 5;
      this.importIngredients(data['ingredients']).then(resolution).catch(catcher);
      this.importFormulas(data['formulas']).then(resolution).catch(catcher);
      this.importSKUs(data['skus']).then(resolution).catch(catcher);
      this.importProductLines(data['productlines']).then(resolution).catch(catcher);
      this.importManufacturingLines(data['manufacturinglines']).then(resolution).catch(catcher);
    }).then(result => {
      console.log(result);
      //popup a dialog telling the user it was successfull
    }).catch(err => {
      console.log(err);
      //popup a dialog telling the user there was an error
    });
  }

  importIngredients(ingredients): Promise<any> {
    return new Promise((resolve,reject) => {
      resolve(true);
    });
  }

  importFormulas(formulas): Promise<any> {
    return new Promise((resolve,reject) => {
      resolve(true);
    });
  }

  importSKUs(skus): Promise<any> {
    return new Promise((resolve,reject) => {
      resolve(true);
    });
  }

  importProductLines(productLines): Promise<any> {
    return new Promise((resolve,reject) => {
      resolve(true);
    });
  }

  importManufacturingLines(manufacturingLines): Promise<any> {
    return new Promise((resolve,reject) => {
      resolve(true);
    });
  }
}

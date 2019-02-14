import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RestService } from '../rest.service';
import { ParseCsvService } from '../parse-csv.service';
import { ImportMatchConflictNewCheckerService } from '../import-match-conflict-new-checker.service';
import { ImportPreviewDialogComponent } from '../import-preview-dialog/import-preview-dialog.component';

@Component({
  selector: 'app-upload',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent  implements OnInit {
  @ViewChild('fileSelector') fileSelector;

  constructor(private parser: ParseCsvService, private importChecker: ImportMatchConflictNewCheckerService, public dialog: MatDialog, public rest:RestService) {}

  openFileSelector() {
    this.fileSelector.nativeElement.click();
  }

  ngOnInit() {

  }

  filesSelected() {
    this.parser.parseCSVFiles(this.fileSelector.nativeElement.files).then(csvResult => {
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
          }
        });

      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }
}

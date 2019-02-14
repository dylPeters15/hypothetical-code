import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ParseCsvService } from './parse-csv.service';
import { ImportMatchConflictNewCheckerService } from './import-match-conflict-new-checker.service';
import { ImportPreviewDialogComponent } from './import-preview-dialog/import-preview-dialog.component';
import { UserNotificationDialogComponent } from '../user-notification-dialog/user-notification-dialog.component';
import { ImportUploadService } from './import-upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
  @ViewChild('fileSelector') fileSelector;
  @ViewChild('fileSelectorForm') fileSelectorForm;

  constructor(private parser: ParseCsvService, private importChecker: ImportMatchConflictNewCheckerService, public dialog: MatDialog, private importUploader: ImportUploadService) { }

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

        // const dialogConfig = new MatDialogConfig();
        // dialogConfig.data = checkResult;
        this.dialog.open(ImportPreviewDialogComponent, {
          data: checkResult,
          height: '90%',
          width: '90%',
        }).afterClosed().subscribe(closeData => {
          console.log(closeData);
          if (!closeData || closeData['cancel']) {
            //operation was cancelled
            console.log("Operation cancelled");
          } else {
            //operation confirmed
            console.log("Operation confirmed.");
            this.importUploader.importData(closeData).then(uploadResult => {
              console.log(uploadResult);
              //popup a dialog telling the user it was successfull
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                title: "Success!",
                message: "Successfully imported data."
              };
              this.dialog.open(UserNotificationDialogComponent, dialogConfig);
            }).catch(err => {
              console.log(err);
              //popup a dialog telling the user there was an error
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                title: "Error!",
                message: "Error importing data."
              };
              this.dialog.open(UserNotificationDialogComponent, dialogConfig);
            });
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

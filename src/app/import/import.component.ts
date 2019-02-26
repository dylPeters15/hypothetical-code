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

  private numNew(uploadData) {
    var numNew = 0;
    for (let key of Object.keys(uploadData)) {
      var objectDict = uploadData[key];
      numNew += objectDict['new'].length;
    }
    return numNew;
  }

  private numUpdated(uploadData) {
    var numNew = 0;
    for (let key of Object.keys(uploadData)) {
      var objectDict = uploadData[key];
      numNew += objectDict['conflicts'].filter((value, index, array) => {
        return value['select'] == 'new';
      }).length;
    }
    return numNew;
  }

  filesSelected() {
    this.parser.parseCSVFiles(this.fileSelector.nativeElement.files).then(csvResult => {
      this.fileSelectorForm.nativeElement.reset();
      this.importChecker.checkAll(csvResult).then(checkResult => {
        console.log("Check result: ",checkResult);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = checkResult;
        dialogConfig.minWidth = "50%";
        this.dialog.open(ImportPreviewDialogComponent, dialogConfig).afterClosed().subscribe(closeData => {
          if (!closeData || closeData['cancel']) {
            //operation was cancelled
          } else {
            //operation confirmed
            this.importUploader.importData(closeData).then(() => {
              //popup a dialog telling the user it was successfull
              console.log(closeData);
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                title: "Success!",
                message: "Successfully imported " + this.numNew(closeData) + " new records and updated " + this.numUpdated(closeData) + " records."
              };
              this.dialog.open(UserNotificationDialogComponent, dialogConfig);
            }).catch(err => {
              //popup a dialog telling the user there was an error
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                title: "Error!",
                message: "" + err
              };
              this.dialog.open(UserNotificationDialogComponent, dialogConfig);
            });
          }
        });

      }).catch(err => {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          title: "Error!",
          message: "" + err
        };
        this.dialog.open(UserNotificationDialogComponent, dialogConfig);
      });
    }).catch(err => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: "Error!",
        message: "" + err
      };
      this.dialog.open(UserNotificationDialogComponent, dialogConfig);
    });
  }


}

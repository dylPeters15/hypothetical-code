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

  displayErrorDialog(err, thisObject) {
  }

  async filesSelected(): Promise<void> {
    var errors = false;

    var csvResult = await this.parser.parseCSVFiles(this.fileSelector.nativeElement.files).catch(err => {
      console.log(err);
      errors = true;
      //popup a dialog telling the user there was an error
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: "Error!",
        message: "" + err&&err.message?err.message:err
      };
      this.dialog.open(UserNotificationDialogComponent, dialogConfig);
    });
    this.fileSelectorForm.nativeElement.reset();
    if (errors) {
      return;
    }

    var checkResult = await this.importChecker.checkAll(csvResult).catch(err => {
      console.log(err);
      errors = true;
      //popup a dialog telling the user there was an error
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: "Error!",
        message: "" + err&&err.message?err.message:err
      };
      this.dialog.open(UserNotificationDialogComponent, dialogConfig);
    });
    console.log("Check result: ", checkResult);
    if (errors) {
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = checkResult;
    dialogConfig.minWidth = "50%";
    var closeData = await this.dialog.open(ImportPreviewDialogComponent, dialogConfig).afterClosed().toPromise();
    if (!closeData || closeData['cancel']) {
      //operation was cancelled
    } else {
      //operation confirmed
      await this.importUploader.importData(closeData).catch(err => {
        errors = true;
        //popup a dialog telling the user there was an error
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          title: "Error!",
          message: "" + err
        };
        this.dialog.open(UserNotificationDialogComponent, dialogConfig);
      });
      if (errors) {
        return;
      }
      // popup a dialog telling the user it was successfull
      console.log(closeData);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: "Success!",
        message: "Successfully imported " + this.numNew(closeData) + " new records and updated " + this.numUpdated(closeData) + " records."
      };
      this.dialog.open(UserNotificationDialogComponent, dialogConfig);
    }
  }


}

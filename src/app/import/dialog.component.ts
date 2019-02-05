import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @ViewChild('file') file;

  public files: Set<File> = new Set();

  constructor(public dialogRef: MatDialogRef<DialogComponent>, public rest:RestService) {}

  ngOnInit() {}

  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  closeDialog() {
    console.log("clicked finish boi");
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.rest.upload(this.files);
    console.log("Progress: " + this.progress);
    // for (const key in this.progress) {
    //   this.progress[key].progress.subscribe(val => console.log(val));
    // }

    // // convert the progress map into an array
    // let allProgressObservables = [];
    // for (let key in this.progress) {
    //   allProgressObservables.push(this.progress[key].progress);
    // }

    // // Adjust the state variables

    // // The OK-button should have the text "Finish" now
    // this.primaryButtonText = 'Finish';

    // // The dialog should not be closed while uploading
    // this.canBeClosed = false;
    // this.dialogRef.disableClose = true;

    // // Hide the cancel-button
    // this.showCancelButton = false;
  }
}

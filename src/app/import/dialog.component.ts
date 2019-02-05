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
    this.progress = this.upload(this.files);
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

  upload(files)
  {
    var toreturn = [];
    console.log(files);
    files.forEach(file => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        var result = JSON.stringify(fileReader.result);
        result = result.substring(1,result.length-1);
        console.log("Result: " + result);

        var splitbyquotes = result.split("\\\"");
        var firsthalfsplit = splitbyquotes[0].split(",");
        var secondhalfsplit = splitbyquotes[2].split(",");
        console.log(splitbyquotes);
        console.log(firsthalfsplit);
        console.log(secondhalfsplit);
        console.log(JSON.stringify(splitbyquotes));
        toreturn.push(this.rest.adminCreateSku(firsthalfsplit[0], firsthalfsplit[1], firsthalfsplit[2], firsthalfsplit[3], firsthalfsplit[4], firsthalfsplit[5], firsthalfsplit[6], splitbyquotes[1], secondhalfsplit[1], this.rest.generateId()));
      }
      fileReader.readAsText(file);


      // create a new multipart-form for every file
      // const formData: FormData = new FormData();
      // formData.append("file", file, file.name);
      // return this.http.post(endpoint + 'my-file', {
      //   name: file.name,
      //   file: file
      // }, this.getHTTPOptions());
    });
    return toreturn
  }
}

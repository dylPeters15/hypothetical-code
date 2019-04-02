import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-view-user-mfg-lines-dialog',
  templateUrl: './view-user-mfg-lines-dialog.component.html',
  styleUrls: ['./view-user-mfg-lines-dialog.component.css']
})
export class ViewUserMfgLinesDialogComponent implements OnInit {

  username = "";
  mfgLines = [];

  constructor(@Inject(MAT_DIALOG_DATA) public initData: any, private dialogRef: MatDialogRef<ViewUserMfgLinesDialogComponent>) { }

  ngOnInit() {
    this.username = this.initData.username;
    console.log(this.initData);
    for (let mfg of this.initData.manufacturinglinestomanage) {
      this.mfgLines.push(mfg.manufacturingline);
    }
    console.log(this.mfgLines);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}

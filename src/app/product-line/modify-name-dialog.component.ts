import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-modify-name-dialog',
    templateUrl: 'modify-name-dialog.component.html',
  })
  export class ModifyNameDialogComponent implements OnInit {

    productlinename: String;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ModifyNameDialogComponent>) {}
  
    ngOnInit() {
      this.productlinename = this.data.productlinename;
    }

    closeDialog() {
      this.dialogRef.close();
      this.productlinename = this.data.productlinename;
    }

    onNoClick() {
      this.dialogRef.close();
    }
  
  }
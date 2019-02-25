import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-new-product-line-dialog',
    templateUrl: 'new-product-line-dialog.component.html',
  })
  export class NewProductLineDialogComponent implements OnInit {

    productlinename: String;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewProductLineDialogComponent>) {}
  
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

    createProductLine() {
      if (this.data.productlinename) {
        this.dialogRef.close(this.data.productlinename);
      }
    }
  
  }
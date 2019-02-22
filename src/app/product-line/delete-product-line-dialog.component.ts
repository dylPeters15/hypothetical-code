import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-delete-product-line-dialog',
    templateUrl: 'delete-product-line-dialog.component.html',
  })
  export class DeletePLDialogComponent implements OnInit {

    productlines: [];
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DeletePLDialogComponent>) {}
  
    ngOnInit() {
      this.productlines = this.data;
    }

    closeDialog() {
      this.dialogRef.close();
      console.log(this.data)
      this.productlines = this.data;
    }
  
  }
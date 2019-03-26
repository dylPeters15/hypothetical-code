import {Component, OnInit, Inject} from '@angular/core';
import { RestServiceV2, AndVsOr } from '../restv2.service';
import {MatDialog,MatSnackBar, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-new-product-line-dialog',
    templateUrl: 'new-product-line-dialog.component.html',
  })
  export class NewProductLineDialogComponent implements OnInit {
    nameExists: boolean = false;
    productlinename: String;
    constructor(public restv2: RestServiceV2, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewProductLineDialogComponent>) {}
  
    async ngOnInit() {
      this.productlinename = this.data.productlinename;
    }

    closeDialog() {
      this.dialogRef.close();
      this.productlinename = this.data.productlinename;
    }

    onNoClick() {
      this.dialogRef.close();
    }

    async createProductLine() {
      if (this.data.productlinename) {
        this.dialogRef.close(this.data.productlinename);
      }
    }
  
  }
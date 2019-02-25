import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-delete-product-line-dialog',
    templateUrl: 'delete-product-line-dialog.component.html',
  })
  export class DeleteProductLineDialogComponent implements OnInit {

    productlines: String[];
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public rest: RestService, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<DeleteProductLineDialogComponent>) {}
  
    selectedOptions: String[] = [];

    ngOnInit() {
      this.productlines = this.data;
    }

    closeDialog() {
      this.productlines = this.selectedOptions;
      console.log("closing selected", this.selectedOptions)
      this.data = this.selectedOptions;
      console.log("closing data", this.data)
      this.deleteProductLines();
      this.dialogRef.close();
    }

    onNgModelChange(event){
      this.selectedOptions = event;
      this.productlines = this.selectedOptions;
      console.log(this.selectedOptions)
    }
  
    deleteProductLines() {
      let i;
        for (i=0; i<this.selectedOptions.length; i++) {
          console.log(this.selectedOptions[i]);
          this.rest.getProductLines(this.selectedOptions[i],"",1).subscribe(data => {
            console.log(data[0].skus.length)
            if (data[0].skus.length != 0) {
              this.snackBar.open("Error deleting product line " + this.selectedOptions[i] + ". Please remove all associated SKUs and try again.", "close", {});
            }
            else {
              this.rest.deleteProductLine(data[0].productlinename).subscribe(results => {
                if (results != null) {
                  console.log(results)
                }
              })
            }
          })
        }
    }

    onNoClick() {
      this.dialogRef.close();
    }
  }
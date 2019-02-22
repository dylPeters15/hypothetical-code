import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-delete-product-line-dialog',
    templateUrl: 'delete-product-line-dialog.component.html',
  })
  export class DeletePLDialogComponent implements OnInit {

    productlines: String[];
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public rest: RestService, private dialogRef: MatDialogRef<DeletePLDialogComponent>) {}
  
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
          this.rest.deleteProductLine(this.selectedOptions[i]).subscribe(results => {
            if (results != null) {
              console.log(results)
            }
          })
        }
    }

    onNoClick() {
      this.dialogRef.close();
    }
  }
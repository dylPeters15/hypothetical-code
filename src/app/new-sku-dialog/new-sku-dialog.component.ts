import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-new-sku-dialog',
  templateUrl: './new-sku-dialog.component.html',
  styleUrls: ['./new-sku-dialog.component.css']
})
export class NewSkuDialogComponent implements OnInit {

  name: string = '';
  sku_number: any = '';
  case_upc_number: string = '';
  unit_upc_number: string = '';
  unit_size: string = '';
  count_per_case: string = '';
  product_line: string = '';
  ingredients: any = [];
  comment: string = '';

  constructor(private dialogRef: MatDialogRef<NewSkuDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
    this.name = '';
    this.sku_number = -1;
    this.case_upc_number = '';
    this.unit_upc_number = '';
    this.unit_size = '';
    this.count_per_case = '';
    this.product_line = '';
    this.ingredients = [];
    this.comment = '';
  }

  createSku() {
    this.rest.adminCreateSku(this.name, this.sku_number, this.case_upc_number, this.unit_upc_number, this.unit_size, this.count_per_case, this.product_line, this.ingredients, this.comment).subscribe(response => {
      if (response['success']) {
        this.snackBar.open("Successfully created sku " + this.name + ".", "close", {
          duration: 2000,
        });
      } else {
        this.snackBar.open("Error creating user " + this.name + ". Please refresh and try again.", "close", {
          duration: 2000,
        });
      }
      this.closeDialog();
    });
  }

}

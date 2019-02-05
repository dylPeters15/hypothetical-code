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
      let i;
      for (i=0; i<this.ingredients.length-1; i = i+2) {
        this.addIngredient(this.ingredients[i], this.name);
      }
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

  addIngredient(ingredient, sku) {
    let newSkus;
    const ingredientNumber = Number(ingredient)
    console.log(ingredient, Number(ingredient))
    this.rest.getIngredientByNumber(ingredient).subscribe(response => {
      console.log("Ingredient skus", response)
      newSkus = response.skus;
    });
    newSkus.push(sku);
    // this.rest.addIngredientSku(ingredient, newSkus);
  }

}

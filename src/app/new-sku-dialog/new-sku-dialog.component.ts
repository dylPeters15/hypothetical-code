import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-new-sku-dialog',
  templateUrl: './new-sku-dialog.component.html',
  styleUrls: ['./new-sku-dialog.component.css']
})
export class NewSkuDialogComponent implements OnInit {

  dialog_title: String;
  edit: Boolean;
  name: String = '';
  sku_number: Number = 0;
  case_upc_number: String = '';
  unit_upc_number: String = '';
  unit_size: String = '';
  count_per_case: String = '';
  product_line: String = '';
  ingredients: Array<Number> = [];
  comment: String = '';
  current_id: Number;
  ingredients_by_id: Array<Number> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewSkuDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.edit = this.data.edit;
    this.name = this.data.present_name;
    this.sku_number = this.data.present_skuNumber;
    this.case_upc_number = this.data.present_caseUpcNumber;
    this.unit_upc_number = this.data.present_unitUpcNumber;
    this.unit_size = this.data.present_unitSize;
    this.count_per_case = this.data.present_countPerCase;
    this.product_line = this.data.present_productLine;
    this.ingredients = this.data.present_ingredientTuples;
    this.comment = this.data.present_comment;
    this.current_id = this.data.present_id;



    // edit == true if sku is being modified, false if a new sku is being created
    if (this.edit == true)
    {
      this.dialog_title = "Modify Sku";
    }
    else this.dialog_title = "Create New Sku";
  }

  closeDialog() {
    this.dialogRef.close();
    this.edit = this.data.edit;
    this.name = this.data.present_name;
    this.sku_number = this.data.present_skuNumber;
    this.case_upc_number = this.data.present_caseUpcNumber;
    this.unit_upc_number = this.data.present_unitUpcNumber;
    this.unit_size = this.data.present_unitSize;
    this.count_per_case = this.data.present_countPerCase;
    this.product_line = this.data.present_productLine;
    this.ingredients = this.data.present_ingredientTuples;
    this.comment = this.data.present_comment;
    this.current_id = this.data.present_id;

  }

  createSku() {
    // generate ID
    console.log("we in here now, and edit is: " + this.edit);
    console.log(this.ingredients);
    for (var i=0; i<this.ingredients.length; i = i+1) {
      console.log('ingredients at index i', this.ingredients[i])
    }
    var id = Math.floor(Math.random() * 1000000000);
    if (this.edit == false)
    {
      console.log("We're creating a new sku");
      for (var i=0; i<this.ingredients.length-1; i = i+2) {
        this.addIngredient(this.ingredients[i], this.name);
      }
      this.rest.adminCreateSku(this.name, this.sku_number, this.case_upc_number, this.unit_upc_number, this.unit_size, this.count_per_case, this.product_line, this.ingredients_by_id, this.comment, id).subscribe(response => {
        
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
    else{
      console.log("We're modifying a sku", this.ingredients);
      for (var i=0; i<this.ingredients.length-1; i = i+2) {
        this.addIngredient(this.ingredients[i], this.name);
        console.log('ingredient array pre push', this.ingredients_by_id)
        this.ingredients_by_id.push(this.ingredients[i+1]);
        console.log('ingredient array new', this.ingredients_by_id);
      }
      this.rest.modifySkuRequest(this.name, this.sku_number, this.case_upc_number, this.unit_upc_number, this.unit_size, this.count_per_case, this.product_line, this.ingredients_by_id, this.comment, this.current_id).subscribe(response => {
        
        if (response['success']) {
          this.snackBar.open("Successfully modifyed sku " + this.name + ".", "close", {
            duration: 2000,
          });
        } else {
          this.snackBar.open("Error modifying sku " + this.name + ". Please refresh and try again.", "close", {
            duration: 2000,
          });
        }
        this.closeDialog();
      });
    }
  }

  addIngredient(ingredient, sku) {
    let newSkus;
    const ingredientNumber = Number(ingredient)
    console.log(ingredient, Number(ingredient))
    this.rest.getIngredientByNumber(ingredient).subscribe(response => {
      console.log("Ingredient skus", response.skus)
      newSkus = response.skus
      console.log("new skus", newSkus)
      newSkus.push(sku);
      console.log("new skus", newSkus)
      this.rest.addIngredientSku(ingredient, newSkus).subscribe(response => {
        console.log("New ingredient data", response)
      });

      this.ingredients_by_id.push(response.id);
    });
  }
}
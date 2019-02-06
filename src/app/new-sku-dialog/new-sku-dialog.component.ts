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
  ingredients: Array<String> = [];
  comment: String = '';
  current_id: Number;

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

  convertToId(input_array)
  {
      let ingredient_array_text: String[] = [];
      for (var index = 0; index < input_array.length - 1; index+=2) { 
        this.rest.getIngredientIdFromName(input_array[index]).subscribe(response => {
          console.log("res: " + response);
          console.log("res: " + response.id);

          ingredient_array_text.push(response.id);
          ingredient_array_text.push(input_array[index + 1]);
          if (ingredient_array_text.length == input_array.length){
            console.log("Made it here at lleast");
            for (var i = 0; i < input_array.length; i++) { 
              console.log("next: " + ingredient_array_text[i]);
            }
            // generate ID
            var id = Math.floor(Math.random() * 1000000000);
            this.rest.adminCreateSku(this.name, this.sku_number, this.case_upc_number, this.unit_upc_number, this.unit_size, this.count_per_case, this.product_line, ingredient_array_text, this.comment, id).subscribe(response => {
              //let i;
              //for (i=0; i<this.sku.length-1; i = i++) {
              //  this.sku[i]
              //  this.addIngredient(this.ingredients[i], this.name);
             // }
              if (response['success']) {
                this.snackBar.open("Successfully created sku " + this.name + ".", "close", {
                  duration: 2000,
                });
              } else {
                this.snackBar.open("Error creating sku " + this.name + ". Please refresh and try again.", "close", {
                  duration: 2000,
                });
              }
              this.closeDialog();
            });
          }
          });
          }
      }
  
  createSku() {
    // generate ID
    console.log("we in here now, and edit is: " + this.edit);
    var id = Math.floor(Math.random() * 1000000000);
    if (this.edit == false)
    {
      var ingredient_array = this.ingredients;
      this.convertToId(ingredient_array);
    }
    else{
      console.log("We're modifying a sku");
      this.rest.modifySkuRequest(this.name, this.sku_number, this.case_upc_number, this.unit_upc_number, this.unit_size, this.count_per_case, this.product_line, this.ingredients, this.comment, this.current_id).subscribe(response => {
        let i;
        for (i=0; i<this.ingredients.length-1; i = i+2) {
          this.addIngredient(this.ingredients[i], this.name);
        }
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
    });
  }
    // console.log("new skus", this.newSkus)
  //   this.newSkus.push(sku);
  //   console.log("new skus", this.newSkus)
  //   this.rest.addIngredientSku(ingredient, this.newSkus).subscribe(response =>
  //     console.log("New ingredient data", response));
  // }

}

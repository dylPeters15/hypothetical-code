import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-new-formula-dialog',
  templateUrl: './new-formula-dialog.component.html',
  styleUrls: ['./new-formula-dialog.component.css']
})
export class NewFormulaDialogComponent implements OnInit {

  dialog_title: String;
  edit: Boolean;
  formulaname: String = '';
  formulanumber: Number = 0;
  ingredientsandquantities: String = '';
  comment: String = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewFormulaDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.edit = this.data.edit;
    this.formulaname = this.data.present_formulaname;
    this.formulanumber = this.data.present_formulanumber;
    this.ingredientsandquantities = this.data.present_ingredientsandquantities;
    this.comment = this.data.present_comment;

    // edit == true if formula is being modified, false if a new sku is being created
    if (this.edit == true)
    {
      this.dialog_title = "Modify Formula";
    }
    else this.dialog_title = "Create New Formula";
  }

  closeDialog() {
    this.dialogRef.close();
    this.edit = this.data.edit;
    this.formulaname = this.data.present_formulaname;
    this.formulanumber = this.data.present_formulanumber;
    this.ingredientsandquantities = this.data.present_ingredientsandquantities;
    this.comment = this.data.present_comment;
  }

  createFormula() {
    // generate ID
    console.log("we in here now, and edit is: " + this.edit);
    if (this.edit == false)
    {
      console.log("We're creating a new formula");
      for (var i=0; i<this.ingredients.length-1; i = i+2) {
        this.addIngredient(this.ingredients[i], this.name);
      }
      // this.rest.adminCreateSku(this.name, this.sku_number, this.case_upc_number, this.unit_upc_number, this.unit_size, this.count_per_case, this.product_line, this.ingredients_by_id, this.comment, id).subscribe(response => {
        
      //   if (response['success']) {
      //     this.snackBar.open("Successfully created sku " + this.name + ".", "close", {
      //       duration: 2000,
      //     });
      //   } else {
      //     this.snackBar.open("Error creating user " + this.name + ". Please refresh and try again.", "close", {
      //       duration: 2000,
      //     });
      //   }
      //   this.closeDialog();
      // });
    }
    else{
      console.log("We're modifying a sku", this.ingredients);
      for (var i=0; i<this.ingredients.length-1; i = i+2) {
        this.addIngredient(this.ingredients[i], this.name);
        console.log('ingredient array pre push', this.ingredients_by_id)
        this.ingredients_by_id.push(this.ingredients[i+1]);
        console.log('ingredient array new', this.ingredients_by_id);
      }
      // this.rest.modifySkuRequest(this.name, this.sku_number, this.case_upc_number, this.unit_upc_number, this.unit_size, this.count_per_case, this.product_line, this.ingredients_by_id, this.comment, this.current_id).subscribe(response => {
        
      //   if (response['success']) {
      //     this.snackBar.open("Successfully modifyed sku " + this.name + ".", "close", {
      //       duration: 2000,
      //     });
      //   } else {
      //     this.snackBar.open("Error modifying sku " + this.name + ". Please refresh and try again.", "close", {
      //       duration: 2000,
      //     });
      //   }
      //   this.closeDialog();
      // });
    }
  }

  addIngredient(ingredient, sku) {
    let newSkus;
    const ingredientNumber = Number(ingredient)
    console.log(ingredient, Number(ingredient))
    // this.rest.getIngredientByNumber(ingredient).subscribe(response => {
    //   console.log("Ingredient skus", response.skus)
    //   newSkus = response.skus
    //   console.log("new skus", newSkus)
    //   newSkus.push(sku);
    //   console.log("new skus", newSkus)
    //   this.rest.addIngredientSku(ingredient, newSkus).subscribe(response => {
    //     console.log("New ingredient data", response)
    //   });

    //   this.ingredients_by_id.push(response.id);
    // });
  }
}
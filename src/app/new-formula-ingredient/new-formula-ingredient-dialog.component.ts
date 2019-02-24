import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-new-formula-ingredient-dialog',
  templateUrl: './new-formula-ingredient-dialog.component.html',
  styleUrls: ['./new-formula-ingredient-dialog.component.css']
})

export class NewFormulaIngredientDialogComponent implements OnInit {

  dialog_title: string;
  edit: Boolean;
  ingredientname: string = '';
  oldingredientname: string = '';
  amount: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewFormulaIngredientDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.edit = this.data.edit;
    this.ingredientname = this.data.present_ingredientname;
    this.oldingredientname = this.data.present_ingredientname;
    this.amount = this.data.present_amount;

    // edit == true if formula is being modified, false if a new formula is being created
    if (this.edit == true)
    {
      this.dialog_title = "Modify Ingredient";
    }
    else this.dialog_title = "Add Ingredient to Formula";
  }

  closeDialog() {
    this.dialogRef.close();
    this.edit = this.data.edit;
    this.ingredientname = this.data.present_ingredientname;
    this.amount = this.data.present_amount;
  }

  addIngredient() {
    // Send the info back 
    // generate ID
  }
}
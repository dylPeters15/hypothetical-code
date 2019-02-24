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
  amount: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewFormulaIngredientDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.edit = this.data.edit;
    this.ingredientname = this.data.present_ingredientname;
    this.oldformulaname = this.data.present_amount;

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
    this.formulaname = this.data.present_formulaname;
    this.oldformulaname = this.data.present_formulaname;
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
      this.rest.createFormula(this.formulaname, this.formulanumber, this.ingredientsandquantities, this.comment).subscribe(response => {
        if (response['success']) {
               this.snackBar.open("Successfully created formula " + this.formulaname + ".", "close", {
                 duration: 2000,
               });
             } else {
               this.snackBar.open("Error creating formula " + this.formulaname + ". Please refresh and try again.", "close", {
                 duration: 2000,
               });
             }
             this.closeDialog();
           });
      }

    else{
      console.log("We're modifying a formula");
      this.rest.modifyFormula(this.oldformulaname, this.formulaname, this.formulanumber, this.ingredientsandquantities, this.comment).subscribe(response => {
         if (response['success']) {
           this.snackBar.open("Successfully modifyed formula " + this.formulaname + ".", "close", {
             duration: 2000,
           });
         } else {
           this.snackBar.open("Error modifying formula " + this.formulaname + ". Please refresh and try again.", "close", {
             duration: 2000,
           });
         }
         this.closeDialog();
       });
    }
  }
}
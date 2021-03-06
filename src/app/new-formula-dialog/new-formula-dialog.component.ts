import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { RestService } from '../rest.service';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { NewFormulaIngredientDialogComponent } from '../new-formula-ingredient/new-formula-ingredient-dialog.component';
import { ingredienttuple } from "./ingredienttuple";
import { RestServiceV2, AndVsOr } from '../restv2.service';


@Component({
  selector: 'app-new-formula-dialog',
  templateUrl: './new-formula-dialog.component.html',
  styleUrls: ['./new-formula-dialog.component.css']
})

export class NewFormulaDialogComponent implements OnInit {

  dialog_title: string;
  create_title: string;
  edit: Boolean;
  formulaname: string = '';
  oldformulaname: string = '';
  formulanumber: number = 0;
  ingredientsandquantities: any[];
  comment: string = '';

  arrayIngredients: any[] = [];
  arrayQuantity: any[] = [];

  newIngredientDialogRef: MatDialogRef<NewFormulaIngredientDialogComponent>;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewFormulaDialogComponent>, public restv2: RestServiceV2, public rest: RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {

    this.edit = this.data.edit;
    this.formulaname = this.data.present_formulaname;
    this.oldformulaname = this.data.present_formulaname;
    this.formulanumber = this.data.present_formulanumber;
    this.ingredientsandquantities = this.data.present_ingredientsandquantities;
    this.comment = this.data.present_comment;
    //console.log("my test array is " + this.testArray);
    // update ingredients and amounts to display
    for (let i = 0; i < this.ingredientsandquantities.length; i++) {
      this.arrayIngredients.push(this.ingredientsandquantities[i].ingredient);
      this.arrayQuantity.push(this.ingredientsandquantities[i].quantity);
    }

    // edit == true if formula is being modified, false if a new formula is being created
    if (this.edit == true) {
      this.dialog_title = "Modify Formula";
      this.create_title = "Save Changes";
    }
    else
    {
      this.dialog_title = "Create New Formula";
      this.create_title = "Create";
    } 
    this.initNum();
  }

  async initNum() {
    var formulanumber = 1;
    while (this.formulanumber == null || this.formulanumber == undefined || this.formulanumber == 0) {
      var formulas = await this.restv2.getFormulas(AndVsOr.AND, null, null, formulanumber, null, null, 1);
      if (formulas.length == 1) {
        formulanumber++;
      } else {
        this.formulanumber = formulanumber;
      }
    }
  }

  refreshData() {
    console.log("refreshing the data");
    this.arrayIngredients = [];
    this.arrayQuantity = [];
    for (let i = 0; i < this.ingredientsandquantities.length; i++) {
      this.arrayIngredients.push(this.ingredientsandquantities[i].ingredient);
      this.arrayQuantity.push(this.ingredientsandquantities[i].quantity);
      console.log("array of index " + i + ": " + this.arrayIngredients[i] + ", " + this.arrayQuantity[i]);
    }
  }

  closeDialog() {
    this.dialogRef.close({formulaname: this.formulaname});
    this.edit = this.data.edit;
    this.formulaname = this.data.present_formulaname;
    this.oldformulaname = this.data.present_formulaname;
    this.formulanumber = this.data.present_formulanumber;
    this.ingredientsandquantities = this.data.present_ingredientsandquantities;
    this.comment = this.data.present_comment;
  }

  // Remove ingredient 
  removeIngredient(item)
  {
    console.log(this.ingredientsandquantities);
    for (var i = 0; i < this.ingredientsandquantities.length; i++)
    {
      if(this.ingredientsandquantities[i].ingredient == item)
      {
        this.ingredientsandquantities.splice(i,1); // remove ith item from array
      }

    }
    console.log(this.ingredientsandquantities);

      this.refreshData();
  }

  // This method is very similar to addIngredientToFormula() but involves removing ingredient as well.
  // TO:DO Good programming practice would suggest these methods be combined.
  modifyIngredient(item, quantity)
  {
    var edit = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { edit: edit, present_name: item.ingredientname, present_amount: quantity, present_ingredientsandquantities: this.ingredientsandquantities};
    this.newIngredientDialogRef = this.dialog.open(NewFormulaIngredientDialogComponent, dialogConfig);
    this.newIngredientDialogRef.afterClosed().subscribe(event => {
      if (this.newIngredientDialogRef.componentInstance.ingredientName && this.newIngredientDialogRef.componentInstance.amount) {
        var new_ingredient = this.newIngredientDialogRef.componentInstance.ingredientName;
        var new_amount = this.newIngredientDialogRef.componentInstance.amount;
        var new_objectid;
        this.rest.getIngredients(new_ingredient, "$a", -1, 1).subscribe(response => {
            this.snackBar.open("Successfully modified ingredient.", "close", {
              duration: 2000,
            });
            new_objectid = response[0];
            let new_ingredienttuple = new ingredienttuple();
            new_ingredienttuple.ingredient = new_objectid;
            new_ingredienttuple.quantity = new_amount;
  
            this.removeIngredient(item);
            this.ingredientsandquantities.push(new_ingredienttuple);
  
            this.refreshData();
          });
      }
      
      });
  }

  addIngredientToFormula(edit, ingredientname, amount) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { edit: edit, present_name: ingredientname, present_amount: amount, present_ingredientsandquantities: this.ingredientsandquantities };
    this.newIngredientDialogRef = this.dialog.open(NewFormulaIngredientDialogComponent, dialogConfig);
    //this.newIngredientDialogRef.componentInstance.amount = this.return_amount;
    //this.newIngredientDialogRef.componentInstance.ingredientNameList = this.ingredientNameList;
    this.newIngredientDialogRef.afterClosed().subscribe(event => {
      if (this.newIngredientDialogRef.componentInstance.ingredientName && this.newIngredientDialogRef.componentInstance.amount) {
        // grab the new formula values
      var new_ingredient = this.newIngredientDialogRef.componentInstance.ingredientName;
      var new_amount = this.newIngredientDialogRef.componentInstance.amount;
      var new_objectid;

      // get object id from ingredient name
      this.rest.getIngredients(new_ingredient, "$a", -1, 1).subscribe(response => {
          this.snackBar.open("Successfully added ingredient" + new_ingredient + ".", "close", {
            duration: 2000,
          });

          new_objectid = response[0];
          let new_ingredienttuple = new ingredienttuple();
          //new_ingredienttuple.create({
          //  ingredient: new_objectid,
          //  quantity: new_amount,
          // });
          new_ingredienttuple.ingredient = new_objectid;
          new_ingredienttuple.quantity = new_amount;
          this.ingredientsandquantities.push(new_ingredienttuple);

          this.refreshData();
        });
      }
      });

  }

  addIngredientButton() {
    this.addIngredientToFormula(false, "", 0);
  }

  async createFormula(): Promise<void> {

    var response = await this.restv2.getFormulas(AndVsOr.OR, this.formulaname, this.formulaname, null, null, null, 1);
    if (response.length == 1 && this.formulaname != this.oldformulaname) {
      this.snackBar.open("Formula name already exists. Please try a new name", "close", {
        duration: 4000,
      });
    }
    else{
      Promise.resolve().then(() =>{this.finishCreateFormula();});
    }
  }

  finishCreateFormula()
  {
    if(this.formulanumber < 0)
    {
      this.snackBar.open("Formula number cannot be negative.", "close", {
        duration: 4000,
      });
    }

    if(this.formulaname.length == 0)
    {
      this.snackBar.open("Please enter a valid formula name.", "close", {
        duration: 4000,
      });
    }

    else if (this.edit == false) {
      this.rest.createFormula(this.formulaname, this.formulanumber, this.ingredientsandquantities, this.comment).subscribe(response => {
          this.snackBar.open("Successfully created formula " + this.formulaname + ".", "close", {
            duration: 2000,
          });
        this.closeDialog();
      });
    }

    else {
      console.log("We're modifying a formula");
      this.rest.modifyFormula(this.oldformulaname, this.formulaname, this.formulanumber, this.ingredientsandquantities, this.comment).subscribe(response => {
        if (response['ok'] == 1) {
          this.snackBar.open("Successfully modified formula " + this.formulaname + ".", "close", {
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
    this.refreshData();
  }
}
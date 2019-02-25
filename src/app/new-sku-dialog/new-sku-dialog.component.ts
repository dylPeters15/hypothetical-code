import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { MatDialogConfig, MatDialog} from "@angular/material";
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
  skuname: String = '';
  oldskuname: String = '';
  skunumber: number = 0;
  caseupcnumber: number = 0;
  unitupcnumber: number = 0;
  unitsize: string = '';
  countpercase: number = 0;
  formula: any = null;
  formulascalingfactor: number = 0;
  manufacturingrate: number = 0;
  comment: String = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewSkuDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.edit = this.data.edit;
    this.skuname = this.data.present_name;
    this.oldskuname = this.data.present_name;
    this.skunumber = this.data.present_skuNumber;
    this.caseupcnumber = this.data.present_caseUpcNumber;
    this.unitupcnumber = this.data.present_unitUpcNumber;
    this.unitsize = this.data.present_unitSize;
    this.countpercase = this.data.present_countPerCase;
    this.formula = this.data.present_formula;
    this.formulascalingfactor = this.data.present_formulascalingfactor;
    this.manufacturingrate = this.data.present_manufacturingrate;
    this.comment = this.data.present_comment;


    // edit == true if sku is being modified, false if a new sku is being created
    if (this.edit == true)
    {
      console.log("setting sku to modify");
      this.dialog_title = "Modify Sku";
    }
    else 
    {
      console.log("setting sku to new");
      this.dialog_title = "Create New Sku";
    }
  }

  closeDialog() {
    this.dialogRef.close();
    this.edit = this.data.edit;
    this.skuname = this.data.present_name;
    this.oldskuname = this.data.present_name;
    this.skunumber = this.data.present_skuNumber;
    this.caseupcnumber = this.data.present_caseUpcNumber;
    this.unitupcnumber = this.data.present_unitUpcNumber;
    this.unitsize = this.data.present_unitSize;
    this.countpercase = this.data.present_countPerCase;
    this.formula = this.data.present_formula;
    this.formulascalingfactor = this.data.present_formulascalingfactor;
    this.manufacturingrate = this.data.present_manufacturingrate;
    this.comment = this.data.present_comment;
  }

  addFormulaToSku(edit, formulaname, sclaingFactor) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {edit: edit, present_name: ingredientname, present_amount: amount, present_ingredientsandquantities: this.ingredientsandquantities};
    this.newIngredientDialogRef = this.dialog.open(NewFormulaIngredientDialogComponent, dialogConfig);
    //this.newIngredientDialogRef.componentInstance.amount = this.return_amount;
    //this.newIngredientDialogRef.componentInstance.ingredientNameList = this.ingredientNameList;
    this.newIngredientDialogRef.afterClosed().subscribe(event => {
      // grab the new formula values
      var new_ingredient = this.newIngredientDialogRef.componentInstance.ingredientName;
      var new_amount = this.newIngredientDialogRef.componentInstance.amount;
      var new_objectid;
      console.log("okay we are back again. ingredient: " + new_ingredient + ", amount: " +  new_amount);

      // get object id from ingredient name
      this.rest.getIngredients(new_ingredient,"", 0, 1).subscribe(response => {
        if (response.length == 0) {
          this.snackBar.open("Error adding ingredient.", "close", {
            duration: 2000,
               });
        } 
        else {
          console.log("located the ingredient. " + response);
          new_objectid = response[0]['_id'];
          console.log("mah object id fam " + new_objectid);
          let new_ingredienttuple = new ingredienttuple();
          //new_ingredienttuple.create({
          //  ingredient: new_objectid,
          //  quantity: new_amount,
         // });
          new_ingredienttuple.ingredient = new_objectid;
          new_ingredienttuple.quantity = new_amount;
          console.log("We are adding a new ingredient tuple with name " + new_ingredient + " and amount " + new_ingredienttuple.quantity);
          this.ingredientsandquantities.push(new_ingredienttuple);
          console.log("ingredients and quantities are now " + this.ingredientsandquantities);
        }
        this.refreshData();
        });
        
        });
        
      }

      addFormulaButton() {
        this.addFormulaToSku(false, "", 0);
    }
  

  createSku() {
    // generate ID
    console.log("we in here now, and edit is: " + this.edit);
    if (this.edit == false)
    {
      console.log("We're creating a new sku");
      this.rest.createSku(this.skuname, this.skunumber, this.caseupcnumber, this.unitupcnumber, this.unitsize, this.countpercase, this.formula, this.formulascalingfactor, this.manufacturingrate, this.comment).subscribe(response => {
        if (response['success']) {
               this.snackBar.open("Successfully created sku " + this.skuname + ".", "close", {
                 duration: 2000,
               });
             } else {
               this.snackBar.open("Error creating user " + this.skuname + ". Please refresh and try again.", "close", {
                 duration: 2000,
               });
             }
             this.closeDialog();
           });
      }

    else{
      console.log("We're modifying a sku");
      this.rest.modifySku(this.oldskuname, this.skuname, this.skunumber, this.caseupcnumber, this.unitupcnumber, this.unitsize, this.countpercase, this.formula, this.formulascalingfactor, this.manufacturingrate, this.comment).subscribe(response => {
        
         if (response['success']) {
           this.snackBar.open("Successfully modifyed sku " + this.skuname + ".", "close", {
             duration: 2000,
           });
         } else {
           this.snackBar.open("Error modifying sku " + this.skuname + ". Please refresh and try again.", "close", {
             duration: 2000,
           });
         }
         this.closeDialog();
       });
    }
  }
}
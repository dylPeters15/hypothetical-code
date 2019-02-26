import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { MatDialogConfig, MatDialog} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { NewSkuFormulaComponent } from '../new-sku-formula/new-sku-formula.component';


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

  formulaname: String = ''; // for displaying purposes.
  formulaExists: Boolean = false; // for displaying purposes.


  chosen_formula: String
  chosen_scaling_factor: Number;
  
  newFormulaDialogRef: MatDialogRef<NewSkuFormulaComponent>;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewSkuDialogComponent>, public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

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

    // update formula and scaling factor to display
    this.formulaExists = this.formulaname != "";
    this.chosen_formula = this.formulaname;
    this.chosen_scaling_factor = this.formulascalingfactor;

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

  refreshData() {
    // update formula and scaling factor to display
    this.formulaExists = this.formulaname != "";
    this.chosen_formula = this.formulaname;
    this.chosen_scaling_factor = this.formulascalingfactor;
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

  //.formulaName = this.formulaName;
  //this.dialogRef.componentInstance.scalingFactor 

  addFormulaToSku(edit, formulaname, scalingFactor) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {edit: edit, present_name: formulaname, present_scalingFactor: scalingFactor};
    this.newFormulaDialogRef = this.dialog.open(NewSkuFormulaComponent, dialogConfig);
    //this.newIngredientDialogRef.componentInstance.amount = this.return_amount;
    //this.newIngredientDialogRef.componentInstance.ingredientNameList = this.ingredientNameList;
    this.newFormulaDialogRef.afterClosed().subscribe(event => {
      // grab the new formula values
      var new_formula = this.newFormulaDialogRef.componentInstance.formulaName;
      this.formulascalingfactor = this.newFormulaDialogRef.componentInstance.scalingFactor;

      // get object id from formula name
      this.rest.getFormulas(new_formula,0, 0, 1).subscribe(response => {
        if (response.length == 0) {
          this.snackBar.open("Error adding formula. Please refresh and try again", "close", {
            duration: 2000,
               });
        } 
        else {
          this.formula = response[0]['formulanumber'];
          this.formulaname = response[0]['formulaname'];
        }
        this.refreshData();
        });
        });
      }

      addFormulaButton() {
        this.addFormulaToSku(false, "", 0);
    }
  
  createSku() {
    if (this.edit == false)
    {
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
    this.refreshData();
  }
}
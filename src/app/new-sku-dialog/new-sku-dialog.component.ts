import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { MatDialogConfig, MatDialog} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { NewSkuFormulaComponent } from '../new-sku-formula/new-sku-formula.component';
import { NewFormulaDialogComponent } from '../new-formula-dialog/new-formula-dialog.component';
import { AssignSkuProductlineComponent } from '../assign-sku-productline/assign-sku-productline.component';

@Component({
  selector: 'app-new-sku-dialog',
  templateUrl: './new-sku-dialog.component.html',
  styleUrls: ['./new-sku-dialog.component.css']
})
export class NewSkuDialogComponent implements OnInit {

  dialog_title: String;
  submit_title: String;
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
  productline: any = null;
  comment: String = '';

  formulaname: String = ''; // for displaying purposes.
  productlinename: String = ''; // for displaying purposes.


  // I know this is weird with the double boolean.
  // They are used to show/hide html content. Idk a better way to do it
  //////////////////////////////////////////////////////////////////////

  formulaDoesNotExist: Boolean = true; // for displaying purposes.
  formulaExists: Boolean = false; // for displaying purposes.

  productLineDoesNotExist: Boolean = true; // for displaying purposes.
  productLineExists: Boolean = false; // for displaying purposes.

  ///////////////////////////////////////////////////////////////////////

  chosen_productline: String
  chosen_formula: String
  chosen_scaling_factor: Number;
  
  newFormulaDialogRef: MatDialogRef<NewSkuFormulaComponent>;
  newDialogRef: MatDialogRef<NewFormulaDialogComponent>;
  assignProductLineDialogRef: MatDialogRef<AssignSkuProductlineComponent>;

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
    this.productline = this.data.present_productline;
    this.manufacturingrate = this.data.present_manufacturingrate;
    this.productline = this.data.present_productline;
    this.comment = this.data.present_comment;

    // update formula and scaling factor to display
    this.refreshData();

    // edit == true if sku is being modified, false if a new sku is being created
    if (this.edit == true)
    {
      console.log("setting sku to modify");
      this.dialog_title = "Modify Sku";
      this.submit_title = "Save Changes";
    }
    else 
    {
      console.log("setting sku to new");
      this.dialog_title = "Create New Sku";
      this.submit_title = "Create";
    }
  }

  refreshData() {
     // Get formula name from id
    if(this.formula == null)
    {
      this.formulaname = "";
    } 
    else if (this.formula['formulaname'] != null)
    {
      this.formulaname = this.formula['formulaname'];
    }

     // update formula and scaling factor to display
    this.formulaDoesNotExist = this.formulaname == "";
    this.formulaExists = !this.formulaDoesNotExist;
    this.chosen_formula = this.formulaname;
    this.chosen_scaling_factor = this.formulascalingfactor;


    if(this.productline == null)
    {
      this.productline = "";
    } 
    else if (this.productline['productlinename'] != null)
    {
      this.productlinename = this.productline['productlinename'];
    }
    console.log("right here it's " + this.formulaname);

     // update formula and scaling factor to display
    this.productLineDoesNotExist = this.productlinename == "";
    this.productLineExists = !this.productLineDoesNotExist;
    this.chosen_productline = this.productlinename;
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
    this.productline = this.data.present_productline;
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
        this.snackBar.open("Successfully added formula " + new_formula, "close", {
          duration: 2000,
             });
          this.formula = response[0]['formulanumber'];
          this.formulaname = response[0]['formulaname'];
        
        this.refreshData();
        });
        });
      }

      addFormulaButton() {
        if(this.formulaname == "")
        {
          this.addFormulaToSku(false, "", 1.0); //new
        }
        else 
        {
          this.addFormulaToSku(true, this.formulaname, this.formulascalingfactor); //modifying
        }        
    }

    newFormulaButton()
    {
      let blankTuple = [];
      this.newFormula(false, "", 0, blankTuple, "");
    }

    // edit
  newFormula(edit, present_formulaname, present_formulanumber, present_ingredientsandquantities, present_comment) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {edit: edit, present_formulaname: present_formulaname, present_formulanumber: present_formulanumber, present_ingredientsandquantities: present_ingredientsandquantities, present_comment:present_comment};
    //console.log('formulas ingredient data', present_ingredientTuples)
    this.newDialogRef = this.dialog.open(NewFormulaDialogComponent, dialogConfig);
    this.newDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  // Product line adds
  addProductLineToSku(edit, productlinename) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {edit: edit, present_name: productlinename};
    this.assignProductLineDialogRef = this.dialog.open(AssignSkuProductlineComponent, dialogConfig);

    //this.newIngredientDialogRef.componentInstance.amount = this.return_amount;
    //this.newIngredientDialogRef.componentInstance.ingredientNameList = this.ingredientNameList;
    this.assignProductLineDialogRef.afterClosed().subscribe(event => {
      // grab the new product line values
      var new_productline = this.assignProductLineDialogRef.componentInstance.productlineName;

     // getProductLines(productlinename: String, productlinenameregex: String, limit: number): Observable<any> {

      // get object id from formula name
      this.rest.getProductLines(new_productline ,new_productline, 1).subscribe(response => {
        this.snackBar.open("Successfully added formula " + new_productline, "close", {
          duration: 2000,
             });
          this.productlinename = response[0]['productlinename'];
        
        this.refreshData();
        });
        });
      }

      addProductLineButton() {
        if(this.productlinename == "")
        {
          this.addProductLineToSku(false, ""); // new
        }
        else 
        {
          this.addProductLineToSku(true, this.productlinename); // modifying
        }        
    }



  
  createSku() {
    if (this.edit == false)
    {
      this.rest.createSku(this.skuname, this.skunumber, this.caseupcnumber, this.unitupcnumber, this.unitsize, this.countpercase, this.formula, this.formulascalingfactor, this.manufacturingrate, this.comment).subscribe(response => {
        this.snackBar.open("Successfully created sku " + this.skuname + ".", "close", {
          duration: 2000,
        });
        this.closeDialog();
           });
      }

    else{
      this.rest.modifySku(this.oldskuname, this.skuname, this.skunumber, this.caseupcnumber, this.unitupcnumber, this.unitsize, this.countpercase, this.formula, this.formulascalingfactor, this.manufacturingrate, this.comment).subscribe(response => {
        this.snackBar.open("Successfully modifyed sku " + this.skuname + ".", "close", {
          duration: 2000,
        });
        this.closeDialog();
      });
    }
    this.refreshData();
  }
}
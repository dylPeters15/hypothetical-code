import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { MatDialogConfig, MatDialog} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { NewSkuFormulaComponent } from '../new-sku-formula/new-sku-formula.component';
import { AssignSkuManufacturingLines } from '../assign-sku-manufacturinglines/assign-sku-manufacturinglines.component';
import { NewFormulaDialogComponent } from '../new-formula-dialog/new-formula-dialog.component';
import { AssignSkuProductlineComponent } from '../assign-sku-productline/assign-sku-productline.component';
import { RestServiceV2, AndVsOr } from '../restv2.service';

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
  manufacturinglines: any[];
  manufacturinglinesNames: string[];

  manufacturingrate: number = 0;
  manufacturingsetupcost: number = 0;
  manufacturingruncost: number = 0;
  productline: string = '';
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

  manufacturingLineDoesNotExist: Boolean = true; // for displaying purposes.
  manufacturingLineExists: Boolean = false; // for displaying purposes.

  ///////////////////////////////////////////////////////////////////////

  chosen_productline: String;
  chosen_formula: String;
  chosen_scaling_factor: Number;
  
  newFormulaDialogRef: MatDialogRef<NewSkuFormulaComponent>;
  newDialogRef: MatDialogRef<NewFormulaDialogComponent>;
  assignProductLineDialogRef: MatDialogRef<AssignSkuProductlineComponent>;
  assignManufacturingLineRef: MatDialogRef<AssignSkuManufacturingLines>;

  constructor(public restv2: RestServiceV2, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewSkuDialogComponent>, public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

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
    this.manufacturinglines = this.data.present_manufacturinglines;
    this.manufacturingrate = this.data.present_manufacturingrate;
    this.comment = this.data.present_comment;
    this.manufacturingsetupcost = this.data.present_manufacturingsetupcost;
    this.manufacturingruncost = this.data.present_manufacturingruncost;
    console.log("MAN2: " + JSON.stringify(this.manufacturinglines))
    console.log("PROD2: " + this.productline)
    this.manufacturinglinesNames = [];
    var index;
    if(this.manufacturinglines != null){
      for (index = 0; index < this.manufacturinglines.length; index++)
      {
        this.manufacturinglinesNames[index] = this.manufacturinglines[index]['linename'];
        console.log("current name IS: " + this.manufacturinglines[index]['shortname']);
      } 
    }

    // update formula and scaling factor to display
    this.refreshData();

    // edit == true if sku is being modified, false if a new sku is being created
    if (this.edit == true)
    {
      this.dialog_title = "Modify Sku";
      this.submit_title = "Save Changes";
    }
    else 
    {
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
    
    this.productlinename = this.productline;
    
    //console.log("right here it's " + this.formulaname);

     // update formula and scaling factor to display
    this.productLineDoesNotExist = this.productlinename == "";
    this.productLineExists = !this.productLineDoesNotExist;
    this.chosen_productline = this.productlinename;

    this.manufacturingLineDoesNotExist = this.manufacturinglines == null || this.manufacturinglines == undefined || this.manufacturinglines.length  == 0;
    this.manufacturingLineExists = !this.manufacturingLineDoesNotExist;
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
      if (this.newFormulaDialogRef.componentInstance.formulaName) {
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
      }
      
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
      this.productline = new_productline;

     // getProductLines(productlinename: String, productlinenameregex: String, limit: number): Observable<any> {

      this.refreshData();
        });
      }

      addProductLineButton() {
        if(this.productline == "")
        {
          this.addProductLineToSku(false, ""); // new
        }
        else 
        {
          this.addProductLineToSku(true, this.productlinename); // modifying
        }        
    }


     // Manufacturing line adds
  addManufacturingLineToSku(edit, manufacturinglines) {
    // console.log("edit product line, ed it: " + edit);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {edit: edit, present_sku: this.skuname, present_lines: manufacturinglines};
    this.assignManufacturingLineRef = this.dialog.open(AssignSkuManufacturingLines, dialogConfig);

    //this.newIngredientDialogRef.componentInstance.amount = this.return_amount;
    //this.newIngredientDialogRef.componentInstance.ingredientNameList = this.ingredientNameList;
    this.assignManufacturingLineRef.afterClosed().subscribe(event => {
      // grab the new product line values
      var linesList = this.assignManufacturingLineRef.componentInstance.selectedLines;
      console.log("yipee ki yay: " + linesList);
      console.log("length: " + linesList.length);

      this.manufacturinglines = linesList;
      var index;
      this.manufacturinglinesNames = [];
      for (index = 0; index < this.manufacturinglines.length; index++)
      {
        this.manufacturinglinesNames[index] = this.manufacturinglines[index]['linename'];
        console.log("current name IS: " + this.manufacturinglines[index]['shortname']);
      } 

        this.refreshData();
        });
      }

      addManufacturingLineButton() {
        if(this.manufacturinglines == null || this.manufacturinglines.length == 0)
        {
          this.addManufacturingLineToSku(false, null); // new
        }
        else 
        {
          this.addManufacturingLineToSku(true, this.manufacturinglines); // modifying
        }        
    }

  async createSku() {
    console.log("right now, formula is " + this.formula); // for some reason formula is the number here?
    var caseAsString = this.caseupcnumber.toString();
    var upcAsString = this.unitupcnumber.toString();

    var caseCheckFlip = caseAsString.substring(0,1) == "0" || caseAsString.substring(0,1) == "1" || caseAsString.substring(0,1) == "6" || caseAsString.substring(0,1) == "7" || caseAsString.substring(0,1) == "8" || caseAsString.substring(0,1) == "9";
    var caseCheck = !caseCheckFlip;
    var upcCheckFlip = upcAsString.substring(0,1) == "0" || upcAsString.substring(0,1) == "1" || upcAsString.substring(0,1) == "6" || upcAsString.substring(0,1) == "7" || upcAsString.substring(0,1) == "8" || upcAsString.substring(0,1) == "9";
    var upcCheck = !upcCheckFlip;
    var caseCheckLength = caseAsString.length != 12;
    var upcCheckLength = upcAsString.length != 12;

    // Don't judge me for this sloppy list of if statements
    if(this.skunumber < 0 || this.caseupcnumber < 0 || this.unitupcnumber < 0 || this.countpercase < 0 || this.formulascalingfactor < 0)
    {
      this.snackBar.open("Numbers cannot be negative.", "close", {
        duration: 4000,
      });
    }

    else if (this.formula == undefined || this.formula == null)
    {
      this.snackBar.open("A formula must be specified for this sku.", "close", {
        duration: 4000,
      });
    }

    else if(caseCheck)
      {
        this.snackBar.open("Case UPC# must start with 0-1 or 6-9.", "close", {
          duration: 2000,
        });
      }

    else if(upcCheck)
      {
        this.snackBar.open("Unit UPC# must start with 0-1 or 6-9.", "close", {
          duration: 2000,
        });
      }

      else if(caseCheckLength)
      {
        this.snackBar.open("Case UPC# must be a 12 digit number", "close", {
          duration: 2000,
        });
      }

      else if(upcCheckLength)
      {
        this.snackBar.open("Unit UPC# must be a 12 digit number", "close", {
          duration: 2000,
        });
      }
      else
      {
    if (this.edit == false)
    {
      var formulaobject = await this.restv2.getFormulas(AndVsOr.OR, null,null,this.formula, null,null,1);
      let formulaId = formulaobject[0]['_id'];
      var created = await this.restv2.createSku(this.skuname, this.skunumber, this.caseupcnumber, this.unitupcnumber, this.unitsize, this.countpercase, formulaId, this.formulascalingfactor, this.manufacturingrate, this.manufacturingsetupcost, this.manufacturingruncost, this.comment);
      this.snackBar.open("Successfully created sku " + this.skuname + ".", "close", {
        duration: 2000,
      });
      console.log("CREATED: " + JSON.stringify(created))
       
        
        // this.manufacturinglines, this.productlinename
        var i;
        for (i = 0; i < this.manufacturinglines.length; i++)
        {
            var thisLine = this.manufacturinglines[i];
            thisLine['skus'].push({
              sku: created['_id']
            });
            this.rest.modifyLine(thisLine['linename'], thisLine['linename'], thisLine['shortname'], thisLine['skus'], thisLine['comment']).subscribe(response => {
              if (created['ok'] != 1 || created['nModified'] != 1)
              {
                // print error
              }
            });
        }

        var productline = await this.restv2.getProductLines(AndVsOr.OR, this.productlinename, this.productlinename, 1);
        // this.rest.getProductLines(this.productlinename, "$a",1).subscribe(productLine => {
          productline[0]['skus'].push({
            sku: created['_id']
          })
          console.log("CREATED: " + JSON.stringify(created))
          this.rest.modifyProductLine(productline[0]['productlinename'], productline[0]['productlinename'], productline[0]['skus']).subscribe(response => {
            if (response['ok'] != 1 || response['nModified'] != 1)
            {
              // print error
            }
          });
        this.closeDialog();
      
      }
    else{
      var modified = await this.restv2.modifySku(AndVsOr.OR,this.oldskuname, this.skuname, this.skunumber, this.caseupcnumber, this.unitupcnumber, this.unitsize, this.countpercase, this.formula, this.formulascalingfactor, this.manufacturingrate, this.manufacturingsetupcost, this.manufacturingruncost, this.comment);
        this.snackBar.open("Successfully modifyed sku " + this.skuname + ".", "close", {
          duration: 2000,
        });
        var modifiedSku = await this.restv2.getSkus(AndVsOr.OR, this.skuname, this.skuname, null,null,null,null,1);
        console.log("CREATED: " + JSON.stringify(modifiedSku))
        var i;
        for (i = 0; i < this.manufacturinglines.length; i++)
        {
            var thisLine = this.manufacturinglines[i];
            thisLine['skus'].push({
              sku: modifiedSku[0]['_id']
            });
            this.rest.modifyLine(thisLine['linename'], thisLine['linename'], thisLine['shortname'], thisLine['skus'], thisLine['comment']).subscribe(response => {
              if (response['ok'] != 1 || response['nModified'] != 1)
              {
                // print error
              }
            });
        }

        var productline = await this.restv2.getProductLines(AndVsOr.OR, this.productlinename, this.productlinename, 1);
        // this.rest.getProductLines(this.productlinename, "$a",1).subscribe(productLine => {
          productline[0]['skus'].push({
            sku: modifiedSku[0]['_id']
          })
          this.rest.modifyProductLine(productline[0]['productlinename'], productline[0]['productlinename'], productline[0]['skus']).subscribe(response => {
            if (response['ok'] != 1 || response['nModified'] != 1)
            {
              // print error
            }
          });
        this.closeDialog();
    }
    this.refreshData();
  }
}
}
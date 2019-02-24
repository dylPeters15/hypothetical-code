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

//   displayedColumns: string[] = ['checked', 'formulaname', 'formulanumber','ingredientsandquantities', 'comment'];

export class NewFormulaDialogComponent implements OnInit {

  dialog_title: String;
  edit: Boolean;
  formulaname: String = '';
  oldformulaname: String = '';
  ingredientsandquantities: number = 0;
  comment: String = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewFormulaDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.edit = this.data.edit;
    this.formulaname = this.data.present_formulaname;
    this.oldformulaname = this.data.present_formulaname;
    this.ingredientsandquantities = this.data.present_ingredientsandquantities;
    this.comment = this.data.present_comment;

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
    this.formulaname = this.data.present_formulaname;
    this.oldformulaname = this.data.present_formulaname;
    this.ingredientsandquantities = this.data.present_ingredientsandquantities;
    this.comment = this.data.present_comment;
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
           this.snackBar.open("Successfully modifyed sku with old name " + this.oldskuname + " and new name " + this.skuname + ".", "close", {
             duration: 2000,
           });
         } else {
           this.snackBar.open("Error modifying sku with old name " + this.oldskuname + " and new name " + this.skuname + ". Please refresh and try again.", "close", {
             duration: 2000,
           });
         }
         this.closeDialog();
       });
    }
  }
}
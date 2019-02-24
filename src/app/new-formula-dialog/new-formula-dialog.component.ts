import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { MatDialogConfig, MatDialog} from "@angular/material";
import { NewFormulaIngredientDialogComponent } from '../new-formula-ingredient-dialog/new-formula-ingredient-dialog.component';


@Component({
  selector: 'app-new-formula-dialog',
  templateUrl: './new-formula-dialog.component.html',
  styleUrls: ['./new-formula-dialog.component.css']
})

export class NewFormulaDialogComponent implements OnInit {

  dialog_title: string;
  edit: Boolean;
  formulaname: string = '';
  oldformulaname: string = '';
  formulanumber: number = 0;
  ingredientsandquantities: any[];
  comment: string = '';
  testArray: string[] = ["cowboy", "giraffe", "clone"];
  newIngredientDialogRef: MatDialogRef<NewFormulaIngredientDialogComponent>;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewFormulaDialogComponent>, public rest:RestService, private snackBar: MatSnackBar,  private dialog: MatDialog) { }

  ngOnInit() {

    this.edit = this.data.edit;
    this.formulaname = this.data.present_formulaname;
    this.oldformulaname = this.data.present_formulaname;
    this.formulanumber = this.data.present_formulanumber;
    this.ingredientsandquantities = this.data.present_ingredientsandquantities;
    this.comment = this.data.present_comment;
    console.log("my test array is " + this.testArray);

    // edit == true if formula is being modified, false if a new formula is being created
    if (this.edit == true)
    {
      this.dialog_title = "Modify Formula";
    }
    else this.dialog_title = "Create New Formula";
  }

  refreshData() {
    // this.rest.getSkus().subscribe(response => {
    //   this.data = response;
    //   this.data.forEach(user => {
    //     user['checked'] = false;
    //   });
    //   console.log(this.data);
    //   this.dataSource =  new MatTableDataSource<UserForTable>(this.data);
    //   this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    // });
    
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

  addIngredientToFormula() {
    const dialogConfig = new MatDialogConfig();
    this.newIngredientDialogRef = this.dialog.open(NewFormulaIngredientDialogComponent, dialogConfig);
    this.newIngredientDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });

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
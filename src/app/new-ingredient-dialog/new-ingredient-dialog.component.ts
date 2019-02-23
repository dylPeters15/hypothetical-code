import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-new-ingredient-dialog',
  templateUrl: './new-ingredient-dialog.component.html',
  styleUrls: ['./new-ingredient-dialog.component.css']
})
export class NewIngredientDialogComponent implements OnInit {

  ingredientname: string;
  ingredientnumber: number;
  vendorinformation: string;
  unitofmeasure: string;
  amount: number;
  costperpackage: number;
  comment: string;

  constructor(private dialogRef: MatDialogRef<NewIngredientDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
    this.ingredientname;
    this.ingredientnumber;
    this.vendorinformation;
    this.unitofmeasure;
    this.amount;
    this.costperpackage;
    this.comment;
  }

  createIngredient() {
    this.rest.createIngredient(this.ingredientname, this.ingredientnumber, 
      this.vendorinformation, this.unitofmeasure, this.amount, this.costperpackage, this.comment).subscribe(response => {
      if (response['success']) {
        this.snackBar.open("Successfully created ingredient " + this.ingredientname + ".", "close", {
          duration: 2000,
        });
        console.log('success')
      } else {
        console.log(response)
        this.snackBar.open("Error creating ingredient " + this.ingredientname + ".", "close", {
          duration: 2000,
        });
        console.log('failure')
      }
      this.closeDialog();
    });
  }

}
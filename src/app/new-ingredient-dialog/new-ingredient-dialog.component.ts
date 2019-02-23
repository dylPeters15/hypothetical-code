import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewIngredientDialogComponent>) { }

  ngOnInit() {
    this.ingredientname = this.data.ingredientname;
    this.ingredientnumber = this.data.ingredientnumber;
    this.vendorinformation = this.data.vendorinformation;
    this.unitofmeasure = this.data.unitofmeasure;
    this.amount = this.data.amount;
    this.costperpackage = this.data.costperpackage;
    this.comment = this.data.comment;
  }

  closeDialog() {
    this.dialogRef.close();
    this.ingredientname = this.data.ingredientname;
    this.ingredientnumber = this.data.ingredientnumber;
    this.vendorinformation = this.data.vendorinformation;
    this.unitofmeasure = this.data.unitofmeasure;
    this.amount = this.data.amount;
    this.costperpackage = this.data.costperpackage;
    this.comment = this.data.comment;
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
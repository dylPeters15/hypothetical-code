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
  units: string[];
  selected: string

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewIngredientDialogComponent>) { }

  ngOnInit() {
    this.ingredientname = this.data.ingredientname;
    this.ingredientnumber = this.data.ingredientnumber;
    this.vendorinformation = this.data.vendorinformation;
    this.unitofmeasure = this.data.unitofmeasure;
    this.amount = this.data.amount;
    this.costperpackage = this.data.costperpackage;
    this.comment = this.data.comment;
    this.units = this.data.units;
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
    this.selected = this.data.selected;
    this.unitofmeasure = this.selected;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  shouldDisableCreateButton() {
    return this.data.ingredientname == '' || isNaN(this.data.amount) || this.data.unitofmeasure == '' || !this.data.unitofmeasure || isNaN(this.data.costperpackage);
  }

}
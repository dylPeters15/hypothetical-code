import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ingredients-and-quantities-dialog',
  templateUrl: './ingredients-and-quantities-dialog.component.html',
  styleUrls: ['./ingredients-and-quantities-dialog.component.css']
})
export class IngredientsAndQuantitiesDialogComponent implements OnInit {

  formula: any;

  constructor(@Inject(MAT_DIALOG_DATA) public initData: any, private dialogRef: MatDialogRef<IngredientsAndQuantitiesDialogComponent>) { }

  ngOnInit() {
    this.formula = this.initData.formula;
    console.log("first ingredient: " + this.formula.ingredientsandquantities[0]['ingredient']);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}

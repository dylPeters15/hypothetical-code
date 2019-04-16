import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { RestService } from '../rest.service';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { ingredienttuple } from "./ingredienttuple";


@Component({
  selector: 'app-formula-info-dialog',
  templateUrl: './formula-info-dialog.component.html',
  styleUrls: ['./formula-info-dialog.component.css']
})

export class FormulaDetailsDialogComponent implements OnInit {

  formula: any;
  formulaname: string = '';
  formulanumber: number = 0;
  ingredientsandquantities: any[];
  comment: string = '';

  arrayIngredients: any[] = [];
  arrayQuantity: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<FormulaDetailsDialogComponent>, public rest: RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {

    this.formulaname = this.formula['formulaname'];
    this.formulanumber = this.formula['formulanumber'];
    this.ingredientsandquantities = this.formula['ingredientsandquantities'];
    this.comment = this.formula['comment'];
    //console.log("my test array is " + this.testArray);
    // update ingredients and amounts to display
    for (let i = 0; i < this.ingredientsandquantities.length; i++) {
      this.arrayIngredients.push(this.ingredientsandquantities[i].ingredient);
      this.arrayQuantity.push(this.ingredientsandquantities[i].quantity);
    }

    // Set up accordian event listener
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      this.classList.toggle("active");

      /* Toggle between hiding and showing the active panel */
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
    }

  }

  refreshData() {
    console.log("refreshing the data");
    this.arrayIngredients = [];
    this.arrayQuantity = [];
    for (let i = 0; i < this.ingredientsandquantities.length; i++) {
      this.arrayIngredients.push(this.ingredientsandquantities[i].ingredient);
      this.arrayQuantity.push(this.ingredientsandquantities[i].quantity);
      console.log("array of index " + i + ": " + this.arrayIngredients[i] + ", " + this.arrayQuantity[i]);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
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
  comment: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<FormulaDetailsDialogComponent>) { }

  ngOnInit() {
    this.formula = this.data.present_formula;
    console.log("formula here: " + this.formula);
    console.log("ingredients and quantities here: " + this.formula.ingredientsandquantities);
    console.log("first ingredient: " + this.formula.ingredientsandquantities[0]['ingredient']);



    this.formulaname = this.formula['formulaname'];
    this.formulanumber = this.formula['formulanumber'];
    this.comment = this.formula['comment'];
    //console.log("my test array is " + this.testArray);

    var acc = document.getElementsByClassName("accordion");
    var i;
    
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        console.log("formula CLICK")
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight){
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } 
      });
    }

  }

  closeDialog() {
    this.dialogRef.close();
  }
}
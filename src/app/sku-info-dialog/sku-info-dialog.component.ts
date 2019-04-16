import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { RestService } from '../rest.service';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogConfig, MatDialog } from "@angular/material";


@Component({
  selector: 'app-sku-info-dialog',
  templateUrl: './sku-info-dialog.component.html',
  styleUrls: ['./sku-info-dialog.component.css']
})

export class SkuDetailsDialogComponent implements OnInit {

  skus: any[];
  names: String[];
  numbers: Number[];
  caseUpcNumbers: Number[];
  unitUpcNumbers: Number[];
  unitSizes: String[];
  countPerCases: Number[]
  formulas: any[];
  formulascalingfactors: Number[];
  manufacturingrates: Number[];
  manufacturingsetupcosts: Number[];
  manufacturingruncosts: Number[];
  comments: String[]

  //formulaname: string = '';
  //formulanumber: number = 0;
  //comment: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SkuDetailsDialogComponent>) { }

  ngOnInit() {
    this.skus = this.data.present_skus;

    for(var j = 0; j < this.skus.length; j++)
    {
      this.names[j] = this.skus[j].skuname;
      this.numbers[j] = this.skus[j].skunumber;
      this.caseUpcNumbers[j] = this.skus[j].caseupcnumber;
      this.unitUpcNumbers[j] = this.skus[j].unitupcnumber;
      this.unitSizes[j] = this.skus[j].unitsize;
      this.countPerCases[j] = this.skus[j].countpercase;
      this.formulas[j] = this.skus[j].formula;
      this.formulascalingfactors[j] = this.skus[j].formulascalingfactor;
      this.manufacturingrates[j] = this.skus[j].manufacturingrate;
      this.manufacturingsetupcosts[j] = this.skus[j].manufacturingsetupcost;
      this.manufacturingruncosts[j] = this.skus[j].manufacturingruncost;
      this.comments[j] = this.skus[j].comment;
    }

    //console.log("my test array is " + this.testArray);

    var acc = document.getElementsByClassName("accordion");
    var i;
    
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
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
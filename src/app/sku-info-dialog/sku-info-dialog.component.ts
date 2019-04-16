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
  names: String[] = [];
  numbers: Number[] = [];
  caseUpcNumbers: Number[] = [];
  unitUpcNumbers: Number[] = [];
  unitSizes: String[] = [];
  countPerCases: Number[] = [];
  formulas: any[] = [];
  formulascalingfactors: Number[] = [];
  manufacturingrates: Number[] = [];
  manufacturingsetupcosts: Number[] = [];
  manufacturingruncosts: Number[] = [];
  comments: String[] = [];

  //formulaname: string = '';
  //formulanumber: number = 0;
  //comment: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SkuDetailsDialogComponent>) { }

  ngOnInit() {
    this.skus = this.data.present_skus;
    console.log("skus over here: " + this.skus);
    for(var j = 0; j < this.skus.length; j++)
    {
      this.names.push(this.skus[j].skuname);
      this.numbers.push(this.skus[j].skunumber);
      this.caseUpcNumbers.push(this.skus[j].caseupcnumber);
      this.unitUpcNumbers.push(this.skus[j].unitupcnumber);
      this.unitSizes.push(this.skus[j].unitsize);
      this.countPerCases.push(this.skus[j].countpercase);
      this.formulas.push(this.skus[j].formula);
      this.formulascalingfactors.push(this.skus[j].formulascalingfactor);
      this.manufacturingrates.push(this.skus[j].manufacturingrate);
      this.manufacturingsetupcosts.push(this.skus[j].manufacturingsetupcost);
      this.manufacturingruncosts.push(this.skus[j].manufacturingruncost);
      this.comments.push(this.skus[j].comment);
    }

  }

  // Calling my event listener in ngOnInit() means it's called before the children have been initialized.
  // I needed to use ngAfterViewInit() hook.
  ngAfterViewInit() {
    var acc = document.getElementsByClassName("accordion");
    var k;
    
    for (k = 0; k < acc.length;k++) {
      acc[k].addEventListener("click", function() {
        console.log("sku CLICK")
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
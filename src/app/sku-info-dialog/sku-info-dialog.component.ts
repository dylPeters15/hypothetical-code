import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { RestService } from '../rest.service';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { loadQueryList } from '@angular/core/src/render3';


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
  productLineNames: String[][] = [];
  manufacturingLineNames: String[][] = [];
  



  //formulaname: string = '';
  //formulanumber: number = 0;
  //comment: string = '';

  constructor(public restv2: RestServiceV2, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SkuDetailsDialogComponent>) { }

  async ngOnInit(): Promise<void> {
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
      
      // Product Lines
      let productLinesWithSku = [];
      
      var productlines = await this.restv2.getProductLines(AndVsOr.OR, null, ".*", 1000);
      productlines.forEach(productline => {
       productline['skus'].forEach(productLineSku => {
         if(productLineSku['sku']['_id'] == this.skus[j]['_id']){
           productLinesWithSku.push(productline['productlinename'])
         }
       });

      });
      this.productLineNames[j] = productLinesWithSku;


    let manufacturingLinesWithSku = [];
     var manufacturinglines = await this.restv2.getLine(AndVsOr.OR, null,".*", null,null,50);
     manufacturinglines.forEach(manufacturingline => {
       manufacturingline['skus'].forEach(manufacturingLineSku => {
         if(manufacturingLineSku.sku['_id'] == this.skus[j]['_id']){
          manufacturingLinesWithSku.push(manufacturingline['shortname']);
         }
       });
     });
     this.manufacturingLineNames[j] = manufacturingLinesWithSku;

  }
  Promise.resolve().then(() =>{this.loadQueryList();});

}

  // Calling my event listener in ngOnInit() means it's called before the children have been initialized.
  // I needed to use ngAfterViewInit() hook.
  loadQueryList() {
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

    var acc_inner = document.getElementsByClassName("inner_accordion");
    var k_inner;
    
    for (k_inner = 0; k_inner < acc_inner.length;k_inner++) {
      acc_inner[k_inner].addEventListener("click", function() {
        console.log("sku CLICK")
        this.classList.toggle("active_inner");
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

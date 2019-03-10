import { Component, OnInit, Inject, ViewChild, Optional, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatAutocomplete } from "@angular/material";
import { RestServiceV2, AndVsOr } from '../../restv2.service';
import { SkuDrilldownCalcService } from './sku-drilldown-calc.service';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sku-drilldown',
  templateUrl: './sku-drilldown.component.html',
  styleUrls: ['./sku-drilldown.component.css']
})
export class SkuDrilldownComponent implements OnInit {

  selectedSKU = null;
  separatorKeysCodes: number[] = [ENTER];
  skuCtrl = new FormControl();
  autoCompleteSKUs: Observable<string[]> = new Observable(observer => {
    this.skuCtrl.valueChanges.subscribe(async newVal => {
      observer.next(await this.restv2.getSkus(AndVsOr.AND, null, "(?i).*"+newVal+".*", null, null, null, null, 1000))
    });
  });
  @ViewChild('skuInput') skuInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  remove() {
    this.selectedSKU = null;
  }
  selected(event){
    console.log(event);
    this.selectedSKU = event.option.value;
  }
  add(event) {
    console.log(event);
    this.skuInput.nativeElement.value = "";
  }

  sku: any = {};
  allSales: any[] = [];
  salesByWeek: any[] = [];
  prevStartDate = new Date();
  startDate = new Date();
  prevEndDate = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear()+1));
  endDate = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear()+1));

  customers: any[] = [];
  selectedCustomerId: string = "all";
  
  salesTableData: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  allReplacement = 54321;

  constructor(public restv2: RestServiceV2, public calc: SkuDrilldownCalcService, @Optional() private dialogRef: MatDialogRef<SkuDrilldownComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public initData: any) { }

  ngOnInit() {
    if (this.initData && this.initData['sku']) {
      this.sku = this.initData['sku'];
    }
    this.restv2.getCustomers(AndVsOr.OR, null, null, null, 10000).then(response => {
      this.customers = response;
      this.refreshData();
    });
  }

  async refreshData(): Promise<void> {
    if (this.sku['_id']) {
      if (this.startDate < this.endDate) {
        console.log("valid");
        this.prevStartDate = this.startDate;
        this.prevEndDate = this.endDate;
      } else {
        console.log("invalid");
        this.startDate = this.prevStartDate;
        this.endDate = this.prevEndDate;
      }
      console.log("prevStartDate", this.prevStartDate);
      console.log("startDate", this.startDate);
      console.log("prevEndDate", this.prevEndDate);
      console.log("endDate", this.endDate);
      this.allSales = await this.restv2.getSales(AndVsOr.AND, this.sku['_id'], this.selectedCustomerId=="all"?null:this.selectedCustomerId, this.startDate, this.endDate, 54321);
      this.salesByWeek = this.calc.formatSalesForTable(this.allSales);
      this.salesTableData = new MatTableDataSource(this.salesByWeek);
      this.salesTableData.paginator = this.paginator;
    }
  }
  
  getPageSizeOptions() {
    return [5, 20, 50, 100, this.allReplacement];
  }
  ngAfterViewChecked() {
    const matOptions = document.querySelectorAll('mat-option');
   
   
    // If the replacement element was found...
    if (matOptions) {
      const matOptionsLen = matOptions.length;
      // We'll iterate the array backwards since the allReplacement should be at the end of the array
      for (let i = matOptionsLen - 1; i >= 0; i--) {
        const matOption = matOptions[i];
   
        // Store the span in a variable for re-use
        const span = matOption.querySelector('span.mat-option-text');
        // If the spans innerHTML string value is the same as the allReplacement variables string value...
        if ('' + span.innerHTML === '' + this.allReplacement) {
          // Change the span text to "All"
          span.innerHTML = 'All';
          break;
        }
      }
    }
  }
}

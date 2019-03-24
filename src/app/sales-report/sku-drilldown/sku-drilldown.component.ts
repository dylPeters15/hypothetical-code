import { Component, OnInit, Inject, ViewChild, Optional, ElementRef, forwardRef, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatAutocomplete } from "@angular/material";
import { RestServiceV2, AndVsOr } from '../../restv2.service';
import { SkuDrilldownCalcService } from './sku-drilldown-calc.service';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SalesSummaryRowCalcService } from '../sales-summary-row/sales-summary-row-calc.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkuDrilldownComponent),
  multi: true
};

@Component({
  selector: 'app-sku-drilldown',
  templateUrl: './sku-drilldown.component.html',
  styleUrls: ['./sku-drilldown.component.css'],
  providers: [customValueProvider]
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
    this.sku = {};
    this.refreshData();
  }
  selected(event){
    this.selectedSKU = event.option.value;
    this.sku = this.selectedSKU;
    this.refreshData();
  }
  add(event) {
    this.skuInput.nativeElement.value = "";
  }

  sku: any = {};
  allSales: any[] = [];
  salesByWeek: any[] = [];
  prevStartDate = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear()-1));
  startDate = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear()-1));
  prevEndDate = new Date();
  endDate = new Date();

  customers: any[] = [];
  selectedCustomerId: string = "all";
  
  salesTableData: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  allReplacement = 54321;

  constructor(public restv2: RestServiceV2, public calc: SkuDrilldownCalcService, public sumCalc: SalesSummaryRowCalcService, @Optional() private dialogRef: MatDialogRef<SkuDrilldownComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public initData: any) { }

  ngOnInit() {
    if (this.initData && this.initData['sku']) {
      this.sku = this.initData['sku'];
    }
    this.restv2.getCustomers(AndVsOr.OR, null, null, null, 10000).then(response => {
      this.customers = response;
      this.refreshData();
    });
  }

  export() {
    this.calc.exportSKUDrilldown(this.sku, this.selectedCustomerId);
    this.sumCalc.exportSKUSummary(this.sku, this.selectedCustomerId);
  }

  async refreshData(): Promise<void> {
    if (this.sku['_id']) {
      if (this.startDate < this.endDate) {
        this.prevStartDate = this.startDate;
        this.prevEndDate = this.endDate;
      } else {
        this.startDate = this.prevStartDate;
        this.endDate = this.prevEndDate;
      }
      this.allSales = await this.restv2.getSales(AndVsOr.AND, this.sku['_id'], this.selectedCustomerId=="all"?null:this.selectedCustomerId, this.startDate, this.endDate, 54321);
      this.salesByWeek = this.calc.formatSalesForTable(this.allSales);
      this.salesTableData = new MatTableDataSource(this.salesByWeek);
      this.salesTableData.paginator = this.paginator;
    } else {
      this.allSales = [];
      this.salesByWeek = [];
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

  _value = '';
  stringified = '';
  keys = [];

  propagateChange: any = () => { };

  @Input() label: string;

  writeValue(value: any) {
    if (value) {
      this._value = value;
      this.stringified = JSON.stringify(value);
      this.keys = Object.keys(value);
      if (value && value['selectedSKU'] && value['selectedSKU']['_id']) {
        this.sku = value['selectedSKU'];
        this.selectedSKU = value['selectedSKU'];
      }
      if (value && value['selectedCustomerId']) {
        this.selectedCustomerId = value['selectedCustomerId'];
      }
      this.refreshData();
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void { }

  onChange(event) {
    this.stringified = JSON.stringify(event.target.value);
    this.keys = Object.keys(event.target.value);
    this.propagateChange(event.target.value);
  }
}

import { Component, OnInit, Inject, ViewChild, Optional, ElementRef, forwardRef, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatAutocomplete, DateAdapter, MatDatepicker, MatDatepickerInputEvent } from "@angular/material";
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { Moment } from 'moment';

// import {default as _rollupMoment, Moment} from 'moment';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD',
  },
  display: {
    dateInput: 'MM/DD',
    monthYearLabel: 'MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class SummaryRow{
  totalSales: number = 0;
  timespan: string = '';

  constructor(totalSales, timespan){
    this.totalSales = totalSales;
    this.timespan = timespan;
  }
}

export class AverageRow{
  average: string = '';
  title: string = '';

  constructor(average, title){
    this.average = average;
    this.title = title;
  }
}

@Component({
  selector: 'app-sales-projection',
  templateUrl: './sales-projection.component.html',
  styleUrls: ['./sales-projection.component.css'],
  providers: [ {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},]
})
export class SalesProjectionComponent implements OnInit {
  selectedSKU = null;
  separatorKeysCodes: number[] = [ENTER];
  skuCtrl = new FormControl();
  startdate: Date;
  enddate: Date;
  allSales: any[] = [];
  autoCompleteSKUs: Observable<string[]> = new Observable(observer => {
    this.skuCtrl.valueChanges.subscribe(async newVal => {
      observer.next(await this.restv2.getSkus(AndVsOr.AND, null, "(?i).*"+newVal+".*", null, null, null, null, 1000))
    });
  });
  displayedColumns: string[] = ['timespan', 'sales'];
  avgDisplayedColumns: string[] = ['title', 'average'];
  tableData: SummaryRow[] = [];
  dataSource = new MatTableDataSource<SummaryRow>(this.tableData);
  averageData: AverageRow[] = [];
  avgDataSource = new MatTableDataSource<AverageRow>(this.averageData);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('skuInput') skuInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  remove() {
    this.selectedSKU = null;
  }
  selected(event){
    this.selectedSKU = event.option.value;
  }
  add(event) {
    this.skuInput.nativeElement.value = "";
  }

  constructor(public restv2: RestServiceV2, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.selectedSKU = this.data['sku']
  }

  startdateCtrl = new FormControl(moment());

  chosenDayHandler(normalizedDay: Moment) {
    const ctrlValue = this.startdateCtrl.value;
    ctrlValue.day(normalizedDay.day());
    this.startdateCtrl.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.startdateCtrl.value;
    ctrlValue.month(normalizedMonth.month());
    this.startdateCtrl.setValue(ctrlValue);
    datepicker.close();
  }

  enddateCtrl = new FormControl(moment());

  endDayHandler(normalizedDay: Moment) {
    const ctrlValue = this.enddateCtrl.value;
    ctrlValue.day(normalizedDay.day());
    this.startdateCtrl.setValue(ctrlValue);
  }

  endMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.enddateCtrl.value;
    ctrlValue.month(normalizedMonth.month());
    this.enddateCtrl.setValue(ctrlValue);
    datepicker.close();
  }

  async showProjection() {
    this.tableData = [];
    this.averageData = [];
    var year = this.getEndYear();
    await this.summarize(year);
    this.dataSource = new MatTableDataSource<SummaryRow>(this.tableData);
    await this.calculateAverage();
    console.log(this.averageData)
  }

  async calculateAverage(){
    var sum = 0;
    this.allSales.forEach(totalSales => {
      sum += totalSales;
    })
    let average = Math.round(sum/4);
    var squaredDiffs = [];
    this.allSales.forEach(totalSales => {
      squaredDiffs.push(Math.pow(totalSales-average,2));
    })
    let deviationSum = 0;
    squaredDiffs.forEach(squaredDiff => {
      deviationSum += squaredDiff;
    })
    let standardDeviationSquared = deviationSum/4;
    let standardDeviation = Math.round(10*Math.sqrt(standardDeviationSquared))/10;
    let averageString = average + " +/- " + standardDeviation;
    let averageRow = new AverageRow(averageString, 'Average +/- SD')
    this.averageData.push(averageRow)
    this.avgDataSource = new MatTableDataSource<AverageRow>(this.averageData);
  }

  async summarize(endYear){
    var currentYear = 0;
    for(currentYear = endYear - 3; currentYear <= endYear; currentYear++){
      var yearsSales = [];
      var currentStartDate = this.startdate;
      currentStartDate.setFullYear(currentYear)
      var currentEndDate = this.enddate;
      currentEndDate.setFullYear(currentYear)
      yearsSales = await this.restv2.getSales(AndVsOr.AND, this.selectedSKU['_id'],null, this.startdate, this.enddate, 54321);
      await this.calculateSales(yearsSales, currentStartDate, currentEndDate);
    }
  }

  async calculateSales(sales, start, end){
    var sum = 0;
    sales.forEach(sale => {
      sum += sale['numcases'];
    });
    this.allSales.push(sum);
    let startString = start.getMonth()+1 + '/' + start.getDate() + '/' + start.getFullYear();
    let endString = end.getMonth()+1 + '/' + end.getDate() + '/' + end.getFullYear();
    let timespan = startString + " to " +  endString;
    let newRow = new SummaryRow(sum, timespan)
    this.tableData.push(newRow)
  }

  getEndYear(){
    let today = new Date();
    if(this.startdate.getMonth() > this.enddate.getMonth()){
      this.startdate.setFullYear(today.getFullYear() - 1)
    }
    console.log("START : " + this.startdate + " END : " + this.enddate + " TODAY: " + today)
    if(this.startdate <= today && this.enddate >= today){
      return today.getFullYear() - 1;
    }
    else if(this.enddate <= today && this.startdate <= today){
      return today.getFullYear();
    }
    else if(this.startdate >= today && this.enddate >=today){
      return today.getFullYear() - 1;
    }

  }

  addStartDate(type:string, event: MatDatepickerInputEvent<Date>){
    this.startdate = new Date(event.value);
  }
  addEndDate(type:string, event: MatDatepickerInputEvent<Date>){
    this.enddate = new Date(event.value);
  }
}
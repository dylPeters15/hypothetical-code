import { Component, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { RestServiceV2, AndVsOr } from '../restv2.service';

@Component({
  selector: 'app-assign-sku-productline',
  templateUrl: './assign-sku-productline.component.html',
  styleUrls: ['./assign-sku-productline.component.css']
})

export class AssignSkuProductlineComponent implements OnInit {

  dialog_title: string;
  edit: Boolean;
  visible = true;
  selectable = true;
  removeable = true;
  addOnBlue = true;
  seperatorKeysCodes: number[] = [ENTER, COMMA]
  productlineCtrl = new FormControl();
  filteredProductlines: Observable<string[]> = new Observable(observer => {
    this.productlineCtrl.valueChanges.subscribe(async newVal => {
      observer.next(await this.restv2.getProductLines(AndVsOr.OR, null, "(?i).*"+newVal+".*",1000));
    });
  });
  selectedProductlineNames: string[] = [];
  productlineNameList: string[] = [];
  productlineList: any = [];
  productlineName: string;
  productlineId: any;

  @ViewChild('productlineInput') productlineInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public restv2: RestServiceV2, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AssignSkuProductlineComponent>, public rest:RestService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.edit = this.data.edit;
    this.productlineName = this.data.present_productlinename;

    // edit == true if formula is being modified, false if a new formula is being created
    if (this.edit == true)
    {
      this.dialog_title = "Change SKU's Product Line";
    }
    else this.dialog_title = "Add SKU's Product Line";

    this.rest.getProductLines('','.*',5).subscribe(response => {
      this.productlineList = response;
      this.productlineList.forEach(element => {
        this.productlineNameList.push(element.productlinename)
      });
    });
  }

  closeDialog() {
    this.productlineList = [];
    this.selectedProductlineNames = [];

    //this.amount = 5;
    // console.log("Let's send the data back! new product line: " + this.productlineName);
    // this.dialogRef.componentInstance.productlineName = this.productlineName;
    this.dialogRef.close();

    //this.dialogRef.close();
    //this.edit = this.data.edit;
    //this.ingredientname = this.data.present_ingredientname;
    //this.amount = this.data.present_amount;
  }

  addProductLine() {
    console.log("Let's send the data back! new product line: " + this.productlineName);
    this.dialogRef.componentInstance.productlineName = this.productlineName;
    this.closeDialog()
  }

  cancel() {
    this.dialogRef.componentInstance.productlineName = null
    this.closeDialog();
  }

  add(event: MatChipInputEvent): void {
    // Add formula only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our formula
      if ((value || '').trim()) {
        this.productlineName = value.trim();
        this.selectedProductlineNames.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.productlineCtrl.setValue(null);
    }
  }

  remove(formula: string): void {
    this.productlineName = "";
    const index = this.selectedProductlineNames.indexOf(formula);

    if (index >= 0) {
      this.selectedProductlineNames.splice(index, 1);
    }
  }
  
  selected(event: MatAutocompleteSelectedEvent): void {
    this.productlineName = event.option.viewValue;
    this.selectedProductlineNames.push(event.option.viewValue);

    this.rest.getFormulas(event.option.viewValue, 0,0,5).subscribe(response => {
      var i;
      for(i = 0; i<response.length; i++){
        this.productlineId = {formula: response[i]['_id']};
      }
    });
    this.productlineInput.nativeElement.value = '';
    this.productlineCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.productlineNameList.filter(formula => formula.toLowerCase().indexOf(filterValue) === 0);
  }

}
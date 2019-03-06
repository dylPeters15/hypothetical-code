import { Component, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-choose-product-line-dialog',
  templateUrl: './choose-product-line-dialog.component.html',
  styleUrls: ['./choose-product-line-dialog.component.css']
})

export class ChooseProductLineDialogComponent implements OnInit {

  dialog_title: string;
  //edit: Boolean;
  visible = true;
  selectable = true;
  removeable = true;
  addOnBlue = true;
  seperatorKeysCodes: number[] = [ENTER, COMMA]
  productLineCtrl = new FormControl();
  filteredProductLines: Observable<String[]>;
  selectedProducttLineNames: string[] = [];
  productLineNameList: string[] = [];
  productLineList: any = [];

  productLineName: string;
  productLineId: any;

  @ViewChild('productLineInput') productLineInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ChooseProductLineDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) {
    this.filteredProductLines = this.productLineCtrl.valueChanges.pipe(
      startWith(null),
      map((productline: string | null) => productline ? this._filter(productline) : this.productLineNameList.slice()));
   }

  ngOnInit() {
    console.log("in init for pL. ");
    //this.edit = this.data.edit;
    //this.productLineName = this.data.present_name;
    //console.log("edit: " + this.edit);
    //console.log("productLineName: " + this.productLineName);


    // edit == true if product line is being modified, false if a new product line is being created
    //if (this.edit == true)
    //{
     // this.dialog_title = "Change Product Line";
    //}
    //else this.dialog_title = "Add Product Line";
    this.dialog_title = "Select Product Line";

    this.rest.getProductLines('','.*',5,).subscribe(response => {
      this.productLineList = response;
      console.log("hey!!! my response now is ", response);
      this.productLineList.forEach(element => {
        this.productLineNameList.push(element.productlinename)
      });
    });
  }

  closeDialog() {
    this.productLineList = [];
    this.selectedProducttLineNames = [];

    //this.amount = 5;
    console.log("Let's send the data back! new ingredient: " + this.productLineName);
    this.dialogRef.componentInstance.productLineName = this.productLineName;
    this.dialogRef.close();
  }

  addProductLine() {
    this.closeDialog()
  }

  add(event: MatChipInputEvent): void {
    // Add product line only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our product line
      if ((value || '').trim()) {
        this.productLineName = value.trim();
        this.selectedProducttLineNames.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.productLineCtrl.setValue(null);
    }
  }

  remove(productline: string): void {
    this.productLineName = "";
    const index = this.selectedProducttLineNames.indexOf(productline);

    if (index >= 0) {
      this.selectedProducttLineNames.splice(index, 1);
    }
  }
  
  selected(event: MatAutocompleteSelectedEvent): void {
    console.log("NOW. " + event.option.viewValue);
    this.productLineName = event.option.viewValue;
    this.selectedProducttLineNames.push(event.option.viewValue);

    this.rest.getProductLines(event.option.viewValue, "", 5).subscribe(response => {
      console.log("response: ", response);

      var i;
      for(i = 0; i<response.length; i++){
        this.productLineId = {productline: response[i]['_id']};
      }
    });
    this.productLineInput.nativeElement.value = '';
    this.productLineCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.productLineNameList.filter(productline => productline.toLowerCase().indexOf(filterValue) === 0);
  }

}
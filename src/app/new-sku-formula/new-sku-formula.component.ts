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
  selector: 'app-new-sku-formula',
  templateUrl: './new-sku-formula.component.html',
  styleUrls: ['./new-sku-formula.component.css']
})

export class NewSkuFormulaComponent implements OnInit {

  dialog_title: string;
  edit: Boolean;
  visible = true;
  selectable = true;
  removeable = true;
  addOnBlue = true;
  seperatorKeysCodes: number[] = [ENTER, COMMA]
  formulaCtrl = new FormControl();
  filteredFormulas: Observable<string[]> = new Observable(observer => {
    this.formulaCtrl.valueChanges.subscribe(async newVal => {
      observer.next(await this.restv2.getFormulas(AndVsOr.AND, null, "(?i).*"+newVal+".*", null,null,null,1000));
    });
  });
  selectedFormulaNames: string[] = [];
  formulaNameList: string[] = [];
  formulaList: any = [];
  formulaName: string;
  formulaId: any;
  scalingFactor: number = 0;

  @ViewChild('formulaInput') formulaInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public restv2: RestServiceV2, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewSkuFormulaComponent>, public rest:RestService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    console.log("in init fam");
    this.edit = this.data.edit;
    this.scalingFactor = this.data.present_scalingFactor;
    this.formulaName = this.data.present_name;
    console.log("edit: " + this.edit);
    console.log("scalingFactor: " + this.scalingFactor);
    console.log("formulaName: " + this.formulaName);


    // edit == true if formula is being modified, false if a new formula is being created
    if (this.edit == true)
    {
      this.dialog_title = "Change SKU's Formula";
    }
    else this.dialog_title = "Add SKU's Formula";

    this.rest.getFormulas('',0,0,5,'.*').subscribe(response => {
      this.formulaList = response;
      this.formulaList.forEach(element => {
        this.formulaNameList.push(element.formulaname)
      });
    });
  }

  closeDialog() {
    this.formulaName = null;
    this.dialogRef.close();

    //this.dialogRef.close();
    //this.edit = this.data.edit;
    //this.ingredientname = this.data.present_ingredientname;
    //this.amount = this.data.present_amount;
  }

  addFormula() {
    
    this.formulaList = [];
    this.selectedFormulaNames = [];

    //this.amount = 5;
    console.log("Let's send the data back! new ingredient: " + this.formulaName + ". Amount: " + this.scalingFactor);
    this.dialogRef.componentInstance.formulaName = this.formulaName;
    this.dialogRef.componentInstance.scalingFactor = this.scalingFactor;
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    // Add formula only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our formula
      if ((value || '').trim()) {
        this.formulaName = value.trim();
        this.selectedFormulaNames.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.formulaCtrl.setValue(null);
    }
  }

  remove(formula: string): void {
    this.formulaName = "";
    const index = this.selectedFormulaNames.indexOf(formula);

    if (index >= 0) {
      this.selectedFormulaNames.splice(index, 1);
    }
  }
  
  selected(event: MatAutocompleteSelectedEvent): void {
    this.formulaName = event.option.viewValue;
    this.selectedFormulaNames.push(event.option.viewValue);

    this.rest.getFormulas(event.option.viewValue, 0,0,5).subscribe(response => {
      var i;
      for(i = 0; i<response.length; i++){
        this.formulaId = {formula: response[i]['_id']};
      }
    });
    this.formulaInput.nativeElement.value = '';
    this.formulaCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.formulaNameList.filter(formula => formula.toLowerCase().indexOf(filterValue) === 0);
  }

}
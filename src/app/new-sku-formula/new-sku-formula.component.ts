import { Component, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

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
  filterFormulas: Observable<String[]>;
  formulaNameList: string[] = [];
  formulaList: any = [];
  formulaName: string;
  formulaId: any;




  selectedIngredients: any = [];
  amount: number = 0;
  ingredientsandquantities: any[];

  @ViewChild('formulaInput') formulaInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewSkuFormulaComponent>, public rest:RestService, private snackBar: MatSnackBar) {
    this.filterFormulas = this.formulaCtrl.valueChanges.pipe(
      startWith(null),
      map((formula: string | null) => formula ? this._filter(formula) : this.formulaNameList.slice()));
   }

  ngOnInit() {

    this.edit = this.data.edit;
    this.amount = this.data.present_amount;
    this.ingredientsandquantities = this.data.present_ingredientsandquantities;

    // edit == true if formula is being modified, false if a new formula is being created
    if (this.edit == true)
    {
      this.dialog_title = "Change SKU's Formula";
    }
    else this.dialog_title = "Add SKU's Formula";

    this.rest.getFormulas('','.*',0,5).subscribe(response => {
      this.formulaList = response;
      this.formulaList.forEach(element => {
        this.formulaNameList.push(element.ingredientname)
      });
    });
  }

  closeDialog() {
    this.formulaList = [];
    //this.ingredientname = "abc";
    //this.amount = 5;
    console.log("Let's send the data back! new ingredient: " + this.formulaName + ". Amount: " + this.amount);
    this.dialogRef.componentInstance.formulaName = this.formulaName;
    this.dialogRef.componentInstance.amount = this.amount;
    this.dialogRef.close();

    //this.dialogRef.close();
    //this.edit = this.data.edit;
    //this.ingredientname = this.data.present_ingredientname;
    //this.amount = this.data.present_amount;
  }

  addIngredient() {
    this.closeDialog()
  }

  add(event: MatChipInputEvent): void {
    // Add ingredient only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;


      // Add our ingredient
      if ((value || '').trim()) {
        this.formulaName = value.trim();
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.formulaCtrl.setValue(null);
    }
  }

  remove(ingredient: string): void {
    this.formulaName = "";
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.formulaName = event.option.viewValue;
    this.rest.getFormulas(event.option.viewValue, '', 0, 5).subscribe(response => {
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

    return this.ingredientNameList.filter(ingredient => ingredient.toLowerCase().indexOf(filterValue) === 0);
  }

}
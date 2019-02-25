import { Component, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-new-formula-ingredient-dialog',
  templateUrl: './new-formula-ingredient-dialog.component.html',
  styleUrls: ['./new-formula-ingredient-dialog.component.css']
})

export class NewFormulaIngredientDialogComponent implements OnInit {

  dialog_title: string;
  edit: Boolean;
  visible = true;
  selectable = true;
  removeable = true;
  addOnBlue = true;
  seperatorKeysCodes: number[] = [ENTER, COMMA]
  ingredientCtrl = new FormControl();
  filteredIngredients: Observable<String[]>;
  selectedIngredientNames: string[] = [];
  selectedIngredients: any = [];
  ingredientList: any = [];
  ingredientNameList: string[] = [];
  ingredientName: string;
  amount: number = 0;
  ingredientsandquantities: any[];

  @ViewChild('ingredientInput') ingredientInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewFormulaIngredientDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) {
    this.filteredIngredients = this.ingredientCtrl.valueChanges.pipe(
      startWith(null),
      map((ingredient: string | null) => ingredient ? this._filter(ingredient) : this.ingredientNameList.slice()));
   }

  ngOnInit() {

    this.edit = this.data.edit;
    this.amount = this.data.present_amount;
    this.ingredientsandquantities = this.data.present_ingredientsandquantities;

    // edit == true if formula is being modified, false if a new formula is being created
    if (this.edit == true)
    {
      this.dialog_title = "Modify Ingredient";
    }
    else this.dialog_title = "Add Ingredient to Formula";

    this.rest.getIngredients('','.*',0,5).subscribe(response => {
      this.ingredientList = response;
      this.ingredientList.forEach(element => {
        this.ingredientNameList.push(element.ingredientname)
      });
    });
  }

  closeDialog() {
    this.selectedIngredientNames = [];
    this.ingredientList = [];
    this.selectedIngredients = [];

    //this.ingredientname = "abc";
    //this.amount = 5;
    console.log("Let's send the data back! new ingredient: " + this.ingredientName + ". Amount: " + this.amount);
    this.dialogRef.componentInstance.ingredientName = this.ingredientName;
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
        this.selectedIngredientNames.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.ingredientCtrl.setValue(null);
    }
  }

  remove(ingredient: string): void {
    const index = this.selectedIngredientNames.indexOf(ingredient);

    if (index >= 0) {
      this.selectedIngredientNames.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedIngredientNames.push(event.option.viewValue);
    console.log(event.option.viewValue)
    this.ingredientName = event.option.viewValue;
    this.rest.getIngredients(event.option.viewValue, '', 0, 5).subscribe(response => {
      var i;
      for(i = 0; i<response.length; i++){
        this.selectedIngredients.push({ingredient: response[i]['_id']})
      }
    });
    this.ingredientInput.nativeElement.value = '';
    this.ingredientCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ingredientNameList.filter(ingredient => ingredient.toLowerCase().indexOf(filterValue) === 0);
  }

}
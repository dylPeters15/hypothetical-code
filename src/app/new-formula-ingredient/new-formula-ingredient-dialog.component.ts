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
  amount: number = 0;

  @ViewChild('ingredientInput') skuInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewFormulaIngredientDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) {
    this.filteredIngredients = this.ingredientCtrl.valueChanges.pipe(
      startWith(null),
      map((ingredient: string | null) => ingredient ? this._filter(ingredient) : this.ingredientNameList.slice()));
   }

  ngOnInit() {

    this.edit = this.data.edit;
    this.amount = this.data.present_amount;

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
    this.dialogRef.close();
    this.amount = 0;
    this.selectedIngredientNames = [];
    this.ingredientList = [];
    this.selectedIngredients = [];
    this.ingredientNameList = [];

    //this.ingredientname = "abc";
    //this.amount = 5;
    this.dialogRef.componentInstance.ingredientNameList = this.ingredientNameList;
    this.dialogRef.componentInstance.amount = this.amount;
    //this.dialogRef.close();
    //this.edit = this.data.edit;
    //this.ingredientname = this.data.present_ingredientname;
    //this.amount = this.data.present_amount;
  }

  addIngredient() {
    this.closeDialog()
  }
}
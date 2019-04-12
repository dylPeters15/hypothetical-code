import { ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { RestService } from '../rest.service';
import { AndVsOr, RestServiceV2 } from '../restv2.service';

@Component({
  selector: 'app-new-formula-ingredient-dialog',
  templateUrl: './new-formula-ingredient-dialog.component.html',
  styleUrls: ['./new-formula-ingredient-dialog.component.css']
})

export class NewFormulaIngredientDialogComponent implements OnInit {

  selectedIngredient = null;
  separatorKeysCodes: number[] = [ENTER];
  ingredientCtrl = new FormControl();
  autoCompleteIngredients: Observable<string[]> = new Observable(observer => {
    this.ingredientCtrl.valueChanges.subscribe(async newVal => {
      var ingredients = await this.restv2.getIngredients(AndVsOr.AND, null, "(?i).*"+newVal+".*", null, 1000);
      ingredients = ingredients.filter((value,index,array) => {
        for (let ingredient of this.data.present_ingredientsandquantities) {
          if (ingredient.ingredient._id == value._id) {
            return false;
          }
        }
        return true;
      });
      
      observer.next(ingredients);
    });
  });
  @ViewChild('ingredientInput') ingredientInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  remove() {
    this.selectedIngredient = null;
  }
  selected(event){
    this.selectedIngredient = event.option.value;
  }
  add(event) {
    this.ingredientInput.nativeElement.value = "";
  }
  
  dialog_title: string;
  finish_title: string;
  ingredientName: string;
  amount: number = 0;

  constructor(public restv2: RestServiceV2, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewFormulaIngredientDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    var thisobject = this;
    console.log("This.data: ",this.data);
    if (this.data && this.data.present_amount && this.data.present_name != null) {
      console.log("getting ingredients");
      this.restv2.getIngredients(AndVsOr.AND, this.data.present_name, null, null, 1).then(ingredients => {
        console.log("Prepopulated: ",ingredients)
        if (ingredients.length == 1) {
          thisobject.selectedIngredient = ingredients[0];
          thisobject.amount = thisobject.data.present_amount * thisobject.selectedIngredient.amount;

        }
      });
      this.dialog_title = "Modify Ingredient";
      this.finish_title = "Save Changes";
    } else {
      this.dialog_title = "Add Ingredient to Formula";
      this.finish_title = "Add Ingredient";
    }
  }

  closeDialog() {
    console.log("Let's send the data back! new ingredient: " + this.ingredientName + ". Amount: " + this.amount);
    this.dialogRef.componentInstance.ingredientName = null;
    this.dialogRef.componentInstance.amount = null;
    this.dialogRef.close();
  }

  addIngredient() {
    console.log("Let's send the data back! new ingredient: " + this.ingredientName + ". Amount: " + this.amount);
    this.dialogRef.componentInstance.ingredientName = this.selectedIngredient.ingredientname;
    this.dialogRef.componentInstance.amount = this.amount / this.selectedIngredient.amount;
    this.dialogRef.close();
  }

}
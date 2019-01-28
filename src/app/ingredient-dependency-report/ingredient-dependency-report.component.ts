import {Component} from '@angular/core';

export interface IngredientData {
  completion: boolean;
  ingredient: string;
  numberSKUs: number;
  SKUs: string;
}

const INGREDIENT_DATA: IngredientData[] = [
  {completion: false, ingredient: 'Chicken', numberSKUs: 2, SKUs: 'Chicken Noodle Soup; Chicken Tenders'},
  {completion: false, ingredient: 'Salt', numberSKUs: 2, SKUs: 'Chicken Noodle Soup; Tortillas'},
  {completion: false, ingredient: 'Flour', numberSKUs: 1, SKUs: 'Tortillas'}
];
 
/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-ingredient-dependency-report',
  styleUrls: ['./ingredient-dependency-report.component.css'],
  templateUrl: './ingredient-dependency-report.component.html',
})
export class IngredientDependencyComponent {
  displayedColumns: string[] = ['completion','ingredient', 'numberSKUs', 'SKUs'];
  dataSource = INGREDIENT_DATA;
}

import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface IngredientDependencyData {
  // completion: boolean;
  ingredient: string;
  numberSKUs: number;
  SKUs: string;
}

const INGREDIENT_DATA: IngredientDependencyData[] = [
  // {completion: false, ingredient: 'Chicken', numberSKUs: 2, SKUs: 'Chicken Noodle Soup; Chicken Tenders'},
  // {completion: false, ingredient: 'Salt', numberSKUs: 2, SKUs: 'Chicken Noodle Soup; Tortillas'},
  // {completion: false, ingredient: 'Flour', numberSKUs: 1, SKUs: 'Tortillas'}
  {ingredient: 'Chicken', numberSKUs: 2, SKUs: 'Chicken Noodle Soup; Chicken Tenders'},
  {ingredient: 'Salt', numberSKUs: 2, SKUs: 'Chicken Noodle Soup; Tortillas'},
  {ingredient: 'Flour', numberSKUs: 1, SKUs: 'Tortillas'}
];
 
/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-ingredient-dependency-report',
  styleUrls: ['./ingredient-dependency-report.component.css'],
  templateUrl: './ingredient-dependency-report.component.html',
})
export class IngredientDependencyComponent implements OnInit {
  // displayedColumns: string[] = ['completion','ingredient', 'numberSKUs', 'SKUs'];
  displayedColumns: string[] = ['ingredient', 'numberSKUs', 'SKUs'];
  dataSource = new MatTableDataSource(INGREDIENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

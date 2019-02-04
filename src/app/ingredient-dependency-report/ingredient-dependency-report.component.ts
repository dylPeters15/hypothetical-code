import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { MoreInfoDialogComponent } from '../more-info-dialog/more-info-dialog.component';
import { NewIngredientDialogComponent } from '../new-ingredient-dialog/new-ingredient-dialog.component';
import { AfterViewChecked } from '@angular/core';

export interface IngredientData {
  // completion: boolean;
  ingredientName: string;
  ingredientNumber: number;
  numberSKUs: number;
  SKUs: string;
}

// const INGREDIENT_DATA: IngredientData[] = [
//   // {completion: false, ingredient: 'Chicken', numberSKUs: 2, SKUs: 'Chicken Noodle Soup; Chicken Tenders'},
//   // {completion: false, ingredient: 'Salt', numberSKUs: 2, SKUs: 'Chicken Noodle Soup; Tortillas'},
//   // {completion: false, ingredient: 'Flour', numberSKUs: 1, SKUs: 'Tortillas'}
//   {ingredient: 'Chicken', numberSKUs: 2, SKUs: 'Chicken Noodle Soup; Chicken Tenders'},
//   {ingredient: 'Salt', numberSKUs: 2, SKUs: 'Chicken Noodle Soup; Tortillas'},
//   {ingredient: 'Flour', numberSKUs: 1, SKUs: 'Tortillas'}
// ];
 
@Component({
  selector: 'app-ingredient-dependency-report',
  styleUrls: ['./ingredient-dependency-report.component.css'],
  templateUrl: './ingredient-dependency-report.component.html',
})
export class IngredientDependencyComponent implements OnInit {
  displayedColumns: string[] = ['ingredientName', 'ingredientNumber', 'numberSKUs', 'SKUs'];
  constructor(public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }
  data: IngredientData[] = [];
  dialogRef: MatDialogRef<MoreInfoDialogComponent>;
  newDialogRef: MatDialogRef<NewIngredientDialogComponent>;
  dataSource =  new MatTableDataSource<IngredientData>(this.data);

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.rest.getIngredients().subscribe(response => {
      this.data = response;
      // this.data.forEach(user => {
      //   user['checked'] = false;
      // });
      console.log(this.data);
      // this.sortData();
      this.dataSource.sort = this.sort;
      this.dataSource =  new MatTableDataSource<IngredientData>(this.data);
    // this.dataSource.paginator = this.paginator;
    });
    
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

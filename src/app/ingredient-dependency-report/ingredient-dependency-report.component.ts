import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { MoreInfoDialogComponent } from '../more-info-dialog/more-info-dialog.component';
import { NewIngredientDialogComponent } from '../new-ingredient-dialog/new-ingredient-dialog.component';
import { AfterViewChecked } from '@angular/core';

export interface IngredientDependencyData {
  // completion: boolean;
  ingredientname: string;
  ingredientnumber: number;
  numberskus: number;
  skus: string[];
}
 
@Component({
  selector: 'app-ingredient-dependency-report',
  styleUrls: ['./ingredient-dependency-report.component.css'],
  templateUrl: './ingredient-dependency-report.component.html',
})
export class IngredientDependencyComponent implements OnInit {
  allReplacement = 54321;
  displayedColumns: string[] = ['ingredientName', 'ingredientNumber', 'numberSKUs', 'SKUs'];
  constructor(public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }
  data: IngredientDependencyData[] = [];
  dialogRef: MatDialogRef<MoreInfoDialogComponent>;
  newDialogRef: MatDialogRef<NewIngredientDialogComponent>;
  dataSource =  new MatTableDataSource<IngredientDependencyData>(this.data);
  filterQuery: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.refreshData();
  }

  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  refreshData(filterQueryData?) {
    filterQueryData = filterQueryData ? ".*"+filterQueryData+".*" : ".*"+this.filterQuery+".*"; //this returns things that have the pattern anywhere in the string  
    this.rest.getIngredients("", filterQueryData, 0, this.paginator.pageSize*10).subscribe(response => {
      this.data = response;
      console.log(response);
      response.forEach(ingredient => {
        this.rest.getFormulas("", -1, ingredient['_id'], 10).subscribe(formulaResponse => {
          if (formulaResponse) {
            console.log(formulaResponse)
          }
          
        });
      });
      // this.dataSource.sort = this.sort;
      // this.dataSource =  new MatTableDataSource<IngredientDependencyData>(this.data);
      // this.dataSource.paginator = this.paginator;
    });
    
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
}

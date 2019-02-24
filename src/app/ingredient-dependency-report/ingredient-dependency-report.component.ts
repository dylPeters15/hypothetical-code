import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { MoreInfoDialogComponent } from '../more-info-dialog/more-info-dialog.component';
import { NewIngredientDialogComponent } from '../new-ingredient-dialog/new-ingredient-dialog.component';
import { AfterViewChecked } from '@angular/core';

export class IngredientDependencyData {
  // completion: boolean;
  ingredientname: string;
  ingredientnumber: number;
  numberskus: number;
  skus: string[];
  constructor(ingredientname, ingredientnumber, numberskus, skus) {
    this.ingredientname = ingredientname;
    this.ingredientnumber = ingredientnumber;
    this.numberskus = numberskus;
    this.skus = skus;
  }
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
        let skuArray = [];
        this.rest.getFormulas("", -1, ingredient['_id'], 10).subscribe(formulas => {
          if (formulas) {
            console.log(formulas)
            formulas.forEach(formula => {
              console.log(formula['_id'])
              this.rest.getSkus("", "", -1, -1, -1, formula['_id'], 10).subscribe(skus => {
                console.log(skus)
                skus.forEach(sku => {
                  skuArray.push(sku['skuname']);
                })
              })
            })
            
          }
          
        });
        let currentIngredient = new IngredientDependencyData(ingredient['ingredientname'], ingredient['ingredientnumber'], skuArray.length, skuArray);
        this.data.push(currentIngredient);
      });
      this.dataSource.sort = this.sort;
      this.dataSource =  new MatTableDataSource<IngredientDependencyData>(this.data);
      this.dataSource.paginator = this.paginator;
    });
    
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
}

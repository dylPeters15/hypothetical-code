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
    var numingredients;
    var thisobject = this;
    var promise3 = new Promise(function(resolve, reject) {
      thisobject.rest.getIngredients("", filterQueryData, 0, thisobject.paginator.pageSize*10).subscribe(response => {
        console.log(response);
        
        var ingredientsvisited = 0;
        response.forEach(ingredient => {
          thisobject.formulaSearch(ingredient).then(function( skuArray) {
            console.log("final: ", skuArray)
            let currentIngredient = new IngredientDependencyData(ingredient['ingredientname'], ingredient['ingredientnumber'], skuArray.length, skuArray);
            thisobject.data.push(currentIngredient);
            ingredientsvisited ++;

            console.log("ingredientsvisited", ingredientsvisited) 
            if (ingredientsvisited == response.length) {
              resolve();
            }
          }) 
          
        })
        
        
      });
    
    
    });
    promise3.then(() => {
      console.log('data sent')
      this.dataSource.sort = this.sort;
      this.dataSource =  new MatTableDataSource<IngredientDependencyData>(this.data);
      this.dataSource.paginator = this.paginator;
    }) 
  }

  formulaSearch(ingredient) {
    var thisobject = this;
    var total = 100;
    var skuArray = [];
    var numberProcessed = 100;
    return new Promise(function(resolve, reject) {
      thisobject.rest.getFormulas("", -1, ingredient['_id'], 10).subscribe(formulas => {
        if (formulas) {
          total = formulas.length;
          console.log(formulas)
          
        }
        thisobject.skuSearch(formulas, skuArray, total).then(() => {
          if (numberProcessed >= total) {
            console.log('total', total)
            resolve(skuArray)
          } 
        })  
      });
    });
  }


  skuSearch(formulas, skuArray, total) {
    var thisobject = this;
    return new Promise(function(resolve, reject) {
      var formulasvisited = 0;
      formulas.forEach(formula => {
        console.log(formula['_id'])
        thisobject.rest.getSkus("", "", -1, -1, -1, formula['_id'], 10).subscribe(skus => {
          total += skus.length;
          skus.forEach(sku => {
            skuArray.push(sku['skuname']);
            console.log('pushed: ', skuArray)
          })
          resolve(skus.length);
        })
        formulasvisited ++;
      })   
      if (formulasvisited == formulas.length) {
        resolve(skuArray);
      }
    })
  }
}

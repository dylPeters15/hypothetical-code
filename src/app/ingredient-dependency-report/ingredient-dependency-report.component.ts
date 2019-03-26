import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { MoreInfoDialogComponent } from '../more-info-dialog/more-info-dialog.component';
import { NewIngredientDialogComponent } from '../new-ingredient-dialog/new-ingredient-dialog.component';
import { AfterViewChecked } from '@angular/core';
import {ExportToCsv} from 'export-to-csv';

export class IngredientDependencyData {
  // completion: boolean;
  ingredientname: string;
  ingredientnumber: number;
  numberskus: number;
  skus: string[];
  checked: boolean;
  constructor(ingredientname, ingredientnumber, numberskus, skus) {
    this.ingredientname = ingredientname;
    this.ingredientnumber = ingredientnumber;
    this.numberskus = numberskus;
    this.skus = skus;
    this.checked = false;
  }
}

export class ExportableIngredientDependency {
  // completion: boolean;
  ingredientname: string;
  ingredientnumber: number;
  numberskus: number;
  skus: string;
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
  displayedColumns: string[] = ['checked', 'ingredientName', 'ingredientNumber', 'numberSKUs', 'SKUs'];
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
    return [20, 50, 100, this.allReplacement];
  }

  sortData(event) {
    console.log("event:",event);
    console.log("data: ",this.dataSource);
    this.dataSource.data.sort((a,b) => {
      console.log(a[event['active']] > b[event['active']]);
      if (event['direction'] == 'asc') {
        return a[event['active']] > b[event['active']] ? 1 : -1;
      } else {
        return a[event['active']] > b[event['active']] ? -1 : 1;
      }
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  async refreshData(filterQueryData?) {
    this.data = []
    filterQueryData = filterQueryData ? "(?i).*"+filterQueryData+".*" : "(?i).*"+this.filterQuery+".*"; //this returns things that have the pattern anywhere in the string  
    var numingredients;
    var rest = this.rest;
    var thisobject = this;
    this.data = await new Promise(function(resolve, reject) {
      var data = [];
      thisobject.rest.getIngredients("", filterQueryData, 0, thisobject.paginator.pageSize*10).subscribe(response => {
        var ingredientsvisited = 0;
        response.forEach(ingredient => {
          thisobject.formulaSearch(ingredient).then(function( skuArray) {
            let currentIngredient = new IngredientDependencyData(ingredient['ingredientname'], ingredient['ingredientnumber'], 0, skuArray);
            data.push(currentIngredient);
            ingredientsvisited ++; 
            if (ingredientsvisited == response.length) {
              resolve(data);
            }
          }) 
        })
      });
    });
      console.log('data sent', this.data)
      this.dataSource.sort = this.sort;
      this.dataSource =  new MatTableDataSource<IngredientDependencyData>(this.data);
      this.dataSource.paginator = this.paginator;
  }

  formulaSearch(ingredient) {
    var thisobject = this;
    var total = 100;
    var skuArray = [];
    var numberProcessed = 100;
    return new Promise(function(resolve, reject) {
      thisobject.rest.getFormulas("", -1, ingredient['_id'], 10).subscribe(formulas => {
        if (formulas) {
          total = formulas.length
        }
        thisobject.skuSearch(formulas, skuArray, total).then(() => {
          if (numberProcessed >= total) {
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
        thisobject.rest.getSkus("", "", -1, -1, -1, formula['_id'], 10).subscribe(skus => {
          total += skus.length;
          skus.forEach(sku => {
            let skuInfo = " " + sku['skuname'] + ": " + sku['unitsize'] + " * " 
            + sku['countpercase'] + " (" + sku['skunumber'] + ")\n"
            skuArray.push(skuInfo);
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

  deselectAll() {
    this.data.forEach(ingredient => {
      ingredient.checked = false;
    });
  }

  ngAfterViewChecked() {
    const matOptions = document.querySelectorAll('mat-option');
   
   
    // If the replacement element was found...
    if (matOptions) {
      const matOptionsLen = matOptions.length;
      // We'll iterate the array backwards since the allReplacement should be at the end of the array
      for (let i = matOptionsLen - 1; i >= 0; i--) {
        const matOption = matOptions[i];
   
        // Store the span in a variable for re-use
        const span = matOption.querySelector('span.mat-option-text');
        // If the spans innerHTML string value is the same as the allReplacement variables string value...
        if ('' + span.innerHTML === '' + this.allReplacement) {
          // Change the span text to "All"
          span.innerHTML = 'All';
          break;
        }
      }
    }
  }

  selectAll() {
    // var lowerIndex = this.paginator.pageSize * this.paginator.pageIndex;
    // var upperIndex = this.paginator.pageSize * (this.paginator.pageIndex+1);
    // if (this.data.length < upperIndex) {
    //   upperIndex = this.data.length;
    // }
    // this.deselectAll();
    // for (var i = lowerIndex; i < upperIndex; i=i+1) {
    //   this.data[i].checked = true;
    // }

    this.dataSource.filteredData.forEach(formula => {
      formula.checked = true;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportSelected(){
    let exportData: ExportableIngredientDependency[] = [];
    this.data.forEach(ingredient => {
      if(ingredient.checked) {
        let skuStrings = "";
        ingredient.skus.forEach(sku => {
          skuStrings += sku.trim() + "; "
        })
        console.log("ING: " + JSON.stringify(ingredient))
        let ingredientToExport = new ExportableIngredientDependency(ingredient.ingredientname, 
          ingredient.ingredientnumber, ingredient.skus.length, skuStrings);
        exportData.push(ingredientToExport);
      }
    });
      const options = { 
        fieldSeparator: ',',
        filename: 'ingredientdependencies',
        quoteStrings: '',
        decimalSeparator: '.',
        showLabels: true, 
        showTitle: false,
        title: 'Ingredients',
        useTextFile: false,
        useBom: true,
        headers: ["Ingredient Name","Ingr#","Number Of Skus", "Skus"]
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(exportData);
  }

  noneSelected(): boolean {
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].checked) {
        return false;
      }
    }
    return true;
  }
}

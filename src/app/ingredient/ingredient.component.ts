import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatSort, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { MoreInfoDialogComponent } from '../more-info-dialog/more-info-dialog.component';
import { NewIngredientDialogComponent } from '../new-ingredient-dialog/new-ingredient-dialog.component';
import { auth } from '../auth.service';
import {ExportToCsv} from 'export-to-csv';
import {MatIconModule} from '@angular/material/icon'
import { ConfirmDeletionDialogComponent } from '../confirm-deletion-dialog/confirm-deletion-dialog.component';

export interface IngredientForTable {
  ingredientname: string;
  ingredientnumber: number;
  vendorinformation: string;
  unitofmeasure: string;
  amount: number;
  costperpackage: string;
  comment: string;
  checked: boolean;
}

export class ExportableIngredient {
  ingredientnumber: Number;
  ingredientname: String;
  vendorinformation: String;
  unitofmeasure: String;
  costperpackage: String;
  amount: Number;
  comment: String;
  constructor(ingredientForTable){
    this.ingredientnumber = ingredientForTable.ingredientnumber;
    this.ingredientname = ingredientForTable.ingredientname;
    this.vendorinformation = ingredientForTable.vendorinformation;
    this.amount = ingredientForTable.amount;
    this.unitofmeasure = ingredientForTable.unitofmeasure;
    this.costperpackage = ingredientForTable.costperpackage;
    this.comment = ingredientForTable.comment;
  }

}


/**
 * @title Table dynamically changing the columns displayed
 */
@Component({
    selector: 'app-ingredient',
    templateUrl: './ingredient.component.html',
    styleUrls: ['./ingredient.component.css']
  })
export class IngredientComponent  implements OnInit {

  constructor(public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }
  allReplacement = 54321;
  displayedColumns: string[] = ['checked', 'ingredientname', 'ingredientnumber',
    'vendorinformation', 'packagesize', 'costperpackage', 'comment', 'actions'];
  data: IngredientForTable[] = [];
  dialogRef: MatDialogRef<MoreInfoDialogComponent>;
  newDialogRef: MatDialogRef<NewIngredientDialogComponent>;
  dataSource =  new MatTableDataSource<IngredientForTable>(this.data);
  admin: boolean = false;
  filterQuery: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.admin = auth.isAuthenticatedForAdminOperation();
    this.refreshData();
  }

  getPageSizeOptions() {
    return [20, 50, 100, this.allReplacement];
  }

  refreshData(filterQueryData?) {
    filterQueryData = filterQueryData ? ".*"+filterQueryData+".*" : ".*"+this.filterQuery+".*"; //this returns things that have the pattern anywhere in the string
    this.rest.getIngredients("", filterQueryData, -1, this.paginator.pageSize*10).subscribe(response => {
      console.log("in ingredient: ", response);
      this.data = response;
      this.data.forEach(user => {
        user['checked'] = false;
      });
      this.dataSource =  new MatTableDataSource<IngredientForTable>(this.data);
      this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    });
    
  }

  seeInfo(type, content) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {information_content: content, information_type: type};
    this.dialogRef = this.dialog.open(MoreInfoDialogComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  newIngredient() {

    const dialogRef = this.dialog.open(NewIngredientDialogComponent, {
      width: '250px',
      data: {units: ["oz", "lb", "ton", "g", "kg", "fl oz", "pt", "qt", "gal", "mL", "L"]}
    });  
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.rest.createIngredient(result.ingredientname, result.ingredientnumber, 
          result.vendorinformation, result.unitofmeasure, result.amount, 
          result.costperpackage, result.comment).subscribe(response => {
          if (response['_id']) {
            this.snackBar.open("Successfully created ingredient " + result.ingredientname + ".", "close", {
              duration: 2000,
            });
            console.log('success')
          } else {
            console.log(response)
            this.snackBar.open("Error creating ingredient " + result.ingredientname + ".", "close", {
              duration: 2000,
            });
            console.log('failure')
          }
        });
      }    
      this.refreshData();
    });
  }

  sortData() {
    this.data.sort((a,b) => {
      return a.ingredientname > b.ingredientname ? 1 : -1;
    });
  }

  modifyIngredient(oldingredient) {
    console.log(oldingredient)
    const dialogRef = this.dialog.open(NewIngredientDialogComponent, {
      width: '250px',
      data: {ingredientname: oldingredient.ingredientname, 
        ingredientnumber: oldingredient.ingredientnumber, 
        vendorinformation: oldingredient.vendorinformation, 
        unitofmeasure: oldingredient.unitofmeasure, 
        amount: oldingredient.amount, 
        costperpackage: oldingredient.costperpackage, 
        comment: oldingredient.comment,
        units: ["oz", "lb", "ton", "g", "kg", "fl oz", "pt", "qt", "gal", "mL", "L"]}
    });  

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.rest.modifyIngredient(oldingredient.ingredientname, result.ingredientname, result.ingredientnumber, 
          result.vendorinformation, result.unitofmeasure, result.amount, 
          result.costperpackage, result.comment).subscribe(response => {
          if (response['nModified']) {
            this.snackBar.open("Successfully modified ingredient " + oldingredient.ingredientname + ".", "close", {
              duration: 2000,
            });
            console.log('success')
          } else {
            console.log(response)
            this.snackBar.open("Error modifying ingredient " + oldingredient.ingredientname + ".", "close", {
              duration: 2000,
            });
            console.log('failure')
          }
        });
      }   
      this.refreshData();
    });
    
  }

  deleteIngredient(ingredientname) {
    this.rest.deleteIngredient(ingredientname).subscribe(response => {
      this.snackBar.open("Ingredient " + ingredientname + " deleted successfully.", "close", {
        duration: 2000,
      });
      this.data = this.data.filter((value, index, arr) => {
        return value.ingredientname != ingredientname;
      });
      this.refreshData();
    });
  }

  deleteSelected() {
    this.data.forEach(ingredient => {
      var affectedFormulas = [];
      var affectedFormulaNames = [];
      if (ingredient.checked) {
        var thisobject = this;
        let promise1 = new Promise((resolve, reject) => {
          thisobject.rest.getFormulas("", -1, ingredient['_id'], 10).subscribe(formulas => {
            console.log(formulas)
            formulas.forEach((formula) => {
              if (formula['formulaname']) {
                affectedFormulas.push(formula);
                affectedFormulaNames.push(formula['formulaname'])
              }
            });
            resolve();
          });
        });
        promise1.then(() => {
          if (affectedFormulas.length == 0) {
            this.deleteIngredient(ingredient.ingredientname);
          }
          else {
            const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
              width: '250px',
              data: {ingredient: ingredient['ingredientname'],
                  affectedFormulaNames: affectedFormulaNames}
            }); 
              
            dialogRef.afterClosed().subscribe(closeData => {
              if (closeData && closeData['confirmed']) {
                this.deleteIngredient(ingredient['ingredientname']);
                affectedFormulas.forEach((formula) => {
                  var newIngredients = []
                  formula['ingredientsandquantities'].forEach((ingredienttuple) => {
                    console.log(ingredienttuple['ingredient'])
                    if((ingredienttuple['ingredient']['_id'] != ingredient['_id'])) {
                      newIngredients.push(ingredienttuple);
                    }
                  });
                  this.rest.modifyFormula(formula['formulaname'], formula['formulaname'], 
                  formula['formulanumber'], newIngredients, formula['comment']).subscribe(response => {
                    if (response['nModified']) {
                      this.snackBar.open("Successfully modified formula " + formula['formulaname'] + ".", "close", {
                        duration: 2000,
                      });
                      console.log('success')
                    } else {
                      console.log(response)
                      this.snackBar.open("Error modifying formula " + formula['formulaname'] + ".", "close", {
                        duration: 2000,
                      });
                    }
                  })
                })        
              }
            });
          }
        })
      }
    });
  }

  deselectAll() {
    this.data.forEach(ingredient => {
      ingredient.checked = false;
    });
  }

  selectAll() {
    this.data.forEach(ingredient => {
      ingredient.checked = true;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    var lowerIndex = this.paginator.pageSize * this.paginator.pageIndex;
    var upperIndex = this.paginator.pageSize * (this.paginator.pageIndex+1);
    if (this.data.length < upperIndex) {
      upperIndex = this.data.length;
    }
    this.deselectAll();
    for (var i = lowerIndex; i < upperIndex; i=i+1) {
      this.data[i].checked = true;
    }
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

  exportSelected(){
    let exportData: ExportableIngredient[] = [];
    this.data.forEach(ingredient => {
      if(ingredient.checked) {
        let ingredientToExport = new ExportableIngredient(ingredient);
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
        headers: ["Ingr#","Name","Vendor Info", "Amount", "Unit", "Cost", "Comment"]
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

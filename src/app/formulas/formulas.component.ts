import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar, MatAutocomplete} from '@angular/material';
import { MatDialogRef, MatDialog, MatSort, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { MoreInfoDialogComponent } from '../more-info-dialog/more-info-dialog.component';
import { NewFormulaDialogComponent } from '../new-formula-dialog/new-formula-dialog.component';
import { AfterViewChecked } from '@angular/core';
import { auth } from '../auth.service';
import {ExportToCsv} from 'export-to-csv';
import { ingredienttuple } from "../new-formula-dialog/ingredienttuple";
import { ConfirmDeletionDialogComponent } from '../confirm-deletion-dialog/confirm-deletion-dialog.component';
import { IngredientsAndQuantitiesDialogComponent } from '../ingredients-and-quantities-dialog/ingredients-and-quantities-dialog.component';
import { SkuDetailsDialogComponent } from '../sku-info-dialog/sku-info-dialog.component';
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export interface FormulaForTable {
  formulaname: String;
  formulanumber: Number;
  ingredientsandquantities: any[];
  comment: String;
  checked: boolean;
}

export class ExportableFormula {
  formulaname: String;
  formulanumber: Number;
  ingredientsandquantities: any[];
  comment: String;
  constructor(FormulaForTable){
    this.formulaname = FormulaForTable.formulaname;
    this.formulanumber = FormulaForTable.formulanumber;
    this.ingredientsandquantities = FormulaForTable.ingredientsandquantities;
    this.comment = FormulaForTable.comment;
  }
}

/**
 * @title Table dynamically changing the columns displayed
 */
@Component({
    selector: 'app-formulas',
    templateUrl: './formulas.component.html',
    styleUrls: ['./formulas.component.css']
  })
export class FormulaComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER];

  selectedIngredients = [];
  ingredientCtrl = new FormControl();
  autoCompleteIngredients: Observable<string[]> = new Observable(observer => {
    this.ingredientCtrl.valueChanges.subscribe(async newVal => {
      var ingredients = await this.restv2.getIngredients(AndVsOr.AND, null, "(?i).*"+newVal+".*", null, 1000);
      ingredients = ingredients.filter((value, index, array) => {
        for (let ingredient of this.selectedIngredients) {
          if (ingredient._id == value._id) {
            return false;
          }
        }
        return true;
      });
      observer.next(ingredients);
    });
  });
  @ViewChild('ingredientInput') ingredientInput: ElementRef<HTMLInputElement>;
  @ViewChild('ingredientauto') ingredientmatAutocomplete: MatAutocomplete;
  ingredientremove(ingredient) {
    for (var i = 0; i < this.selectedIngredients.length; i++) {
      if (this.selectedIngredients[i]._id == ingredient._id) {
        this.selectedIngredients.splice(i, 1);
        i--;
      }
    }
    this.refreshData();
  }
  ingredientselected(event){
    this.selectedIngredients.push(event.option.value);
    this.refreshData();
  }
  ingredientadd(event) {
    this.ingredientInput.nativeElement.value = "";
  }



  constructor(public restv2: RestServiceV2, public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }
  allReplacement = 54321;
  displayedColumns: string[] = [];
  data: FormulaForTable[] = [];
  dialogRef: MatDialogRef<MoreInfoDialogComponent>;
  newDialogRef: MatDialogRef<NewFormulaDialogComponent>;
  dataSource =  new MatTableDataSource<FormulaForTable>(this.data);
  productmanager: boolean = false;
  filterQuery: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.paginator.pageSize = 20;
    this.productmanager = auth.isAuthenticatedForProductManagerOperation();
    if(this.productmanager){
      this.displayedColumns = ['checked', 'formulaname', 'formulanumber','ingredientsandquantities', 'relatedskus', 'comment',  'actions'];
    }
    else{
      this.displayedColumns = ['checked', 'formulaname', 'formulanumber','ingredientsandquantities', 'relatedskus', 'comment'];
    }
    this.refreshData();
  }

  getPageSizeOptions() {
    return [20, 50, 100, this.allReplacement];
  }

  refreshData(filterQueryData?) {
    console.log("this is def where we refresh.");
    filterQueryData = filterQueryData ? "(?i).*"+filterQueryData+".*" : "(?i).*"+this.filterQuery+".*"; //this returns things that have the pattern anywhere in the string
    this.rest.getFormulas("", null, null, this.paginator.pageSize*10,filterQueryData, null).subscribe(response => {
      console.log("in formula: ", response);
      this.data = response;
      this.data.forEach(user => {
        user['checked'] = false;
      });
      console.log(this.data);

      //filter formulas by ingredients (this is implicitly an OR gate of the ingredients - if a formula contains at least 1 of the selected ingredients it will be shown)
      if (this.selectedIngredients.length > 0) {
        this.data = this.data.filter((value, index, array) => {
          for (let selectedIngredient of this.selectedIngredients) {
            for (let ingredientandquantity of value.ingredientsandquantities) {
              if (selectedIngredient._id == ingredientandquantity.ingredient._id) {
                return true;
              }
            }
          }
          return false;
        });
      }


      this.dataSource =  new MatTableDataSource<FormulaForTable>(this.data);
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

  // edit
  newFormula(edit, present_formulaname, present_formulanumber, present_ingredientsandquantities, present_comment) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {edit: edit, present_formulaname: present_formulaname, present_formulanumber: present_formulanumber, present_ingredientsandquantities: present_ingredientsandquantities, present_comment:present_comment};
    //console.log('formulas ingredient data', present_ingredientTuples)
    this.newDialogRef = this.dialog.open(NewFormulaDialogComponent, dialogConfig);
    this.newDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  newFormulaButton()
  {
    let blankTuple = [];
    this.newFormula(false, "", 1.0, blankTuple, "");
  }

  sortData() {
    this.data.sort((a,b) => {
      return a.formulaname > b.formulaname ? 1 : -1;
    });
  }

  deleteFormulaConfirmed(formula) {
    this.rest.deleteFormula(formula['formulanumber']).subscribe(response => {
      this.snackBar.open("Formula " + formula['formulaname'] + " deleted successfully.", "close", {
        duration: 2000,
      });
      this.data = this.data.filter((value, index, arr) => {
        return value.formulaname != formula['formulaname'];
      });
      this.refreshData();
    });
  }

  modifyFormulaConfirmed(formula) {
    this.newFormula(true, formula['formulaname'], formula['formulanumber'], 
    formula['ingredientsandquantities'], formula['comment']);
  }

  deleteSelected() {
    this.data.forEach(formula => {
      var affectedSkus = [];
      var affectedSkuNames = [];
      if (formula.checked) {
        var thisobject = this;
        let promise1 = new Promise((resolve, reject) => {
          thisobject.rest.getSkus("","", -1, -1, -1, formula['_id'], 10).subscribe(skus => {
            console.log(skus)
            skus.forEach((sku) => {
              if (sku['skuname']) {
                affectedSkus.push(sku);
                affectedSkuNames.push(sku['skuname'])
              }
            });
            resolve();
          });
        });
        promise1.then(() => {
          if (affectedSkus.length == 0) {
            this.deleteFormulaConfirmed(formula);
          }
          else {
            const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
              width: '250px',
              data: {ingredient: formula['formulaname'],
                  affectedFormulaNames: affectedSkuNames}
            }); 
              
            dialogRef.afterClosed().subscribe(closeData => {
              if (closeData && closeData['confirmed']) {
                
                affectedSkus.forEach((sku) => {
                  this.rest.modifySku(sku['skuname'], sku['skuname'], sku['skunumber'],
                  sku['caseupcnumber'], sku['unitupcnumber'], sku['unitsize'], 
                  sku['countpercase'], -1, sku['formulascalingfactor'], 
                  sku['manufacturingrate'],sku['comment']).subscribe(response => {
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
                this.deleteFormulaConfirmed(formula);       
              }
            });
          }
        })
      }
    });
  }

  viewIngredientsAndQuantities(formula) {
    console.log(formula);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {formula: formula};
    this.dialog.open(IngredientsAndQuantitiesDialogComponent, dialogConfig);
  }


  async viewAssociatedSkus(formula) {
    // Get list of skus that are associated with this formula
    var relatedSkus = await this.restv2.getSkus(AndVsOr.OR, null, null, null, null,null, formula, 1000); //1000 is just a large number of skus that use the formula.
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {present_skus: relatedSkus};
    this.dialog.open(SkuDetailsDialogComponent, dialogConfig);
  }

  exportSelected(){
    let exportData: ExportableFormula[] = [];
    this.data.forEach(formula => {
      if(formula.checked) {
        let formulaToExport = new ExportableFormula(formula);
        exportData.push(formulaToExport);
      }
    });
      const options = { 
        fieldSeparator: ',',
        filename: 'skus',
        quoteStrings: '',
        decimalSeparator: '.',
        showLabels: true, 
        showTitle: false,
        title: 'SKUs',
        useTextFile: false,
        useBom: true,
        headers: ["SKU#","Name","Case UPC", "Unit UPC", "Unit Size", "Count per case", "Product Line Name", "Comment"]
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(exportData);
  }
  
  deselectAll() {
    this.data.forEach(formula => {
      formula.checked = false;
    });
  }

  selectAll() {
    this.dataSource.filteredData.forEach(formula => {
      formula.checked = true;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  noneSelected(): boolean {
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].checked) {
        return false;
      }
    }
    return true;
  }

}
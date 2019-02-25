import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatSort, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { MoreInfoDialogComponent } from '../more-info-dialog/more-info-dialog.component';
import { NewFormulaDialogComponent } from '../new-formula-dialog/new-formula-dialog.component';
import { AfterViewChecked } from '@angular/core';
import { auth } from '../auth.service';
import {ExportToCsv} from 'export-to-csv';
import { ingredienttuple } from "../new-formula-dialog/ingredienttuple";

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

  constructor(public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }
  allReplacement = 54321;
  displayedColumns: string[] = ['checked', 'formulaname', 'formulanumber','ingredientsandquantities', 'comment'];
  data: FormulaForTable[] = [];
  dialogRef: MatDialogRef<MoreInfoDialogComponent>;
  newDialogRef: MatDialogRef<NewFormulaDialogComponent>;
  dataSource =  new MatTableDataSource<FormulaForTable>(this.data);
  admin: boolean = false;
  filterQuery: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.paginator.pageSize = 5;
    this.admin = auth.isAuthenticatedForAdminOperation();
    this.refreshData();
  }

  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  refreshData(filterQueryData?) {
    filterQueryData = filterQueryData ? ".*"+filterQueryData+".*" : ".*"+this.filterQuery+".*"; //this returns things that have the pattern anywhere in the string
    this.rest.getFormulas("", null, null, this.paginator.pageSize*10,filterQueryData, null).subscribe(response => {
      console.log("in formula: ", response);
      this.data = response;
      this.data.forEach(user => {
        user['checked'] = false;
      });
      console.log(this.data);
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
    this.newFormula(false, "", 0, blankTuple, "");
  }

  sortData() {
    this.data.sort((a,b) => {
      return a.formulaname > b.formulaname ? 1 : -1;
    });
  }

  deleteFormulaConfirmed(formula) {
    // this.rest.sendAdminDeleteSkuRequest(sku.name).subscribe(response => {
    //   for (var i=0; i<sku.ingredientTuples.length-1; i = i+2) {
    //     this.removeIngredient(sku.ingredientTuples[i], sku.name);
    //   }
    //   this.snackBar.open("Sku " + name + " deleted successfully.", "close", {
    //     duration: 2000,
    //   });
    //   this.data = this.data.filter((value, index, arr) => {
    //     return value.name != name;
    //   });
    //   this.refreshData();
    // });
  }

  modifyFormulaConfirmed(present_formulaname, present_formulanumber, present_ingredientsandquantities, present_comment) {
    this.newFormula(true, present_formulaname, present_formulanumber, present_ingredientsandquantities, present_comment);
  }

  deleteSelected() {
    const dialogConfig = new MatDialogConfig();
    this.data.forEach(formula => {
      if (formula.checked) {
        this.deleteFormulaConfirmed(formula);
      }
    });
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

   modifySelected() {
    const dialogConfig = new MatDialogConfig();
    let counter: number = 0;
    this.data.forEach(user => {
      if (user.checked) {
        counter++;
      }
    });
    if (counter == 0) {
      this.snackBar.open("Please select a sku to modify", "close", {
        duration: 2000,
      });
    }
    else if (counter != 1) {
      this.snackBar.open("Please only select one sku to modify", "close", {
        duration: 2000,
      });
    }
    else{
      this.data.forEach(user => {
        if (user.checked) {
          this.modifyFormulaConfirmed(user.formulaname, user.formulanumber, user.ingredientsandquantities, user.comment);
        }
      });
    }   
  }

  removeIngredient(ingredient, sku) {
    let newSkus;
    // this.rest.getIngredientByNumber(ingredient).subscribe(response => {
    //   newSkus = response.skus
    //   console.log("new skus", newSkus)
    //   newSkus.push(sku);
    //   newSkus = newSkus.filter(function(e) { return e !== sku })
    //   console.log("new skus", newSkus)
    //   this.rest.addIngredientSku(ingredient, newSkus).subscribe(response => {
    //     console.log("New ingredient data", response)
    //   });
    // });
  }
  
  deselectAll() {
    this.data.forEach(user => {
      user.checked = false;
    });
  }

  selectAll() {
    this.data.forEach(user => {
      user.checked = true;
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

}
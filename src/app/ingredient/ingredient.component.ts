import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatSort, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { MoreInfoDialogComponent } from '../more-info-dialog/more-info-dialog.component';
import { NewIngredientDialogComponent } from '../new-ingredient-dialog/new-ingredient-dialog.component';
import { auth } from '../auth.service';
import {ExportToCsv} from 'export-to-csv';

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
    'vendorinformation', 'packagesize', 'costperpackage', 'comment'];
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
    return [5, 10, 20, this.allReplacement];
  }

  refreshData(filterQueryData?) {
    filterQueryData = filterQueryData ? ".*"+filterQueryData+".*" : ".*"+this.filterQuery+".*"; //this returns things that have the pattern anywhere in the string
    this.rest.getIngredients("", filterQueryData, 1, this.paginator.pageSize*10).subscribe(response => {
      this.data = response;
      this.data.forEach(user => {
        user['checked'] = false;
      });
      console.log(this.data);
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

  newIngredient(edit, ingredientname, ingredientnumber,vendorinformation, 
    unitofmeasure, amount, costperpackage, comment) {
    console.log(vendorinformation)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {edit: edit, ingredientname:ingredientname, 
      ingredientnumber:ingredientnumber, vendorinformation:vendorinformation, 
      unitofmeasure:unitofmeasure, amount:amount, costperpackage: costperpackage, comment: comment};
    this.newDialogRef = this.dialog.open(NewIngredientDialogComponent, dialogConfig);
    this.newDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  newIngredientButton() {
    this.newIngredient(false, "", 0, "","", 0, "", 0);
  }

  sortData() {
    this.data.sort((a,b) => {
      return a.ingredientname > b.ingredientname ? 1 : -1;
    });
  }

  // modifyIngredientConfirmed(present_name, present_number, present_vendorInformation, present_packageSize, present_costPerPackage, present_comment, present_id) {
  //   this.newIngredient(true, present_name, present_number, present_vendorInformation, present_packageSize, present_costPerPackage, present_comment, present_id);
  // }

  // modifySelected() {
  //   const dialogConfig = new MatDialogConfig();
  //   let counter: number = 0;
  //   this.data.forEach(ingredient => {
  //     if (ingredient.checked) {
  //       counter++;
  //     }
  //   });
  //   if (counter == 0) {
  //     this.snackBar.open("Please select an ingredient to modify", "close", {
  //       duration: 2000,
  //     });
  //   }
  //   else if (counter != 1) {
  //     this.snackBar.open("Please only select one ingredient to modify", "close", {
  //       duration: 2000,
  //     });
  //   }
  //   else{
  //     this.data.forEach(ingredient => {
  //       if (ingredient.checked) {
  //         this.modifyIngredientConfirmed(ingredient.ingredientname, ingredient.ingredientnumber, ingredient.vendorinformation, 
  //         ingredient.amount, ingredient.unitofmeasure, ingredient.costperpackage, ingredient.comment);
  //       }
  //     });
  //   }   
  // }

  // deleteIngredientConfirmed(name) {
  //   this.rest.sendAdminDeleteIngredientRequest(name).subscribe(response => {
  //     this.snackBar.open("Ingredient " + name + " deleted successfully.", "close", {
  //       duration: 2000,
  //     });
  //     this.data = this.data.filter((value, index, arr) => {
  //       return value.name != name;
  //     });
  //     this.refreshData();
  //   });
  // }

  // deleteSelected() {
  //   const dialogConfig = new MatDialogConfig();
  //       this.data.forEach(user => {
  //         if (user.checked) {
  //           this.deleteIngredientConfirmed(user.name);
  //         }
  //       });
  //     }

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
    this.data.forEach(sku => {
      if(sku.checked) {
        let skuToExport = new ExportableIngredient(sku);
        exportData.push(skuToExport);
      }
    });
      const options = { 
        fieldSeparator: ',',
        filename: 'ingredients',
        quoteStrings: '',
        decimalSeparator: '.',
        showLabels: true, 
        showTitle: false,
        title: 'Ingredients',
        useTextFile: false,
        useBom: true,
        headers: ["Ingr#","Name","Vendor Info", "Size", "Cost", "Comment"]
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(exportData);
  }

}

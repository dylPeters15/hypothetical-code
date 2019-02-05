import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatSort, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { MoreInfoDialogComponent } from '../more-info-dialog/more-info-dialog.component';
import { NewSkuDialogComponent } from '../new-sku-dialog/new-sku-dialog.component';
import { AfterViewChecked } from '@angular/core';

export interface UserForTable {
  name: string;
  checked: boolean;
}


/**
 * @title Table dynamically changing the columns displayed
 */
@Component({
    selector: 'app-sku-inventory',
    templateUrl: './sku-inventory.component.html',
    styleUrls: ['./sku-inventory.component.css']
  })
export class SkuInventoryComponent  implements OnInit {

  constructor(public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }
  allReplacement = 54321;
  displayedColumns: string[] = ['checked', 'name', 'skuNumber','caseUpcNumber', 'unitUpcNumber', 'unitSize', 'countPerCase', 'productLine', 'ingredientTuples', "comment"];
  data: UserForTable[] = [];
  dialogRef: MatDialogRef<MoreInfoDialogComponent>;
  newDialogRef: MatDialogRef<NewSkuDialogComponent>;
  dataSource =  new MatTableDataSource<UserForTable>(this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.refreshData();
  }

  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  refreshData() {
    this.rest.getSkus().subscribe(response => {
      this.data = response;
      this.data.forEach(user => {
        user['checked'] = false;
      });
      console.log(this.data);
      this.dataSource =  new MatTableDataSource<UserForTable>(this.data);
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

  newSku() {
    const dialogConfig = new MatDialogConfig();
    this.newDialogRef = this.dialog.open(NewSkuDialogComponent, dialogConfig);
    this.newDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  sortData() {
    this.data.sort((a,b) => {
      return a.name > b.name ? 1 : -1;
    });
  }

  deleteSkuConfirmed(sku) {
    this.rest.sendAdminDeleteSkuRequest(sku.name).subscribe(response => {
      for (var i=0; i<sku.ingredientTuples.length-1; i = i+2) {
        this.removeIngredient(sku.ingredientTuples[i], sku.name);
      }
      this.snackBar.open("Sku " + name + " deleted successfully.", "close", {
        duration: 2000,
      });
      this.data = this.data.filter((value, index, arr) => {
        return value.name != name;
      });
      this.refreshData();
    });
  }

  deleteSelected() {
    const dialogConfig = new MatDialogConfig();
    this.data.forEach(sku => {
      if (sku.checked) {
        this.deleteSkuConfirmed(sku);
      }
    });
  }

  removeIngredient(ingredient, sku) {
    let newSkus;
    this.rest.getIngredientByNumber(ingredient).subscribe(response => {
      newSkus = response.skus
      console.log("new skus", newSkus)
      newSkus.push(sku);
      newSkus = newSkus.filter(function(e) { return e !== sku })
      console.log("new skus", newSkus)
      this.rest.addIngredientSku(ingredient, newSkus).subscribe(response => {
        console.log("New ingredient data", response)
      });
    });
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
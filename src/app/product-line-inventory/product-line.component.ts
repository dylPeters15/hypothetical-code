import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatSort, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { MoreInfoDialogComponent } from '../more-info-dialog/more-info-dialog.component';
import { NewSkuDialogComponent } from '../new-sku-dialog/new-sku-dialog.component';
import { AfterViewChecked } from '@angular/core';
import { auth } from '../auth.service';

export interface UserForTable {
  name: String;
  skuNumber: Number;
  caseUpcNumber: String;
  unitUpcNumber: String;
  unitSize: String;
  countPerCase: Number;
  productLine: String;
  ingredientTuples: [];
  comment: String;
  id: Number;
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
export class ProductLineInventoryComponent  implements OnInit {

  constructor(public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }
  allReplacement = 54321;
  displayedColumns: string[] = ['checked', 'name', 'skus'];
  data: UserForTable[] = [];
  dialogRef: MatDialogRef<MoreInfoDialogComponent>;
  newDialogRef: MatDialogRef<NewSkuDialogComponent>;
  dataSource =  new MatTableDataSource<UserForTable>(this.data);
  admin: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.admin = auth.isAuthenticatedForAdminOperation();
    this.refreshData();
  }

  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  refreshData() {
    this.rest.getProductLines().subscribe(response => {
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

  // edit
  newProductLine(edit, present_name, present_skus, present_id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {edit: edit, present_name: present_name, present_skus: present_skus, present_id:present_id};
    this.newDialogRef = this.dialog.open(NewSkuDialogComponent, dialogConfig);
    this.newDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  newSkuButton()
  {
    this.newProductLine(false, "", [], 0);
  }

  sortData() {
    this.data.sort((a,b) => {
      return a.name > b.name ? 1 : -1;
    });
  }

  deleteProductLineConfirmed(product_line) {
    this.rest.sendAdminDeleteProductLineRequest(product_line.name).subscribe(response => {
      this.snackBar.open("Sku " + name + " deleted successfully.", "close", {
        duration: 2000,
      });
      this.data = this.data.filter((value, index, arr) => {
        return value.name != name;
      });
      this.refreshData();
    });
  }

  modifySkuConfirmed(present_name, present_skuNumber, present_caseUpcNumber, present_unitUpcNumber,present_unitSize,present_countPerCase,present_productLine,present_ingredientTuples, present_comment, present_id) {
    this.newSku(true, present_name, present_skuNumber, present_caseUpcNumber, present_unitUpcNumber, present_unitSize, present_countPerCase, present_productLine, present_ingredientTuples, present_comment, present_id);
  }

  deleteSelected() {
    const dialogConfig = new MatDialogConfig();
    this.data.forEach(sku => {
      if (sku.checked) {
        this.deleteSkuConfirmed(sku);
      }
    });
  }

   modifySelected() {
        const dialogConfig = new MatDialogConfig();
        let counter: number = 0;
        this.data.forEach(user => {
          if (user.checked) {
            counter++;
          }
        });
        if (counter == 0) 
        {
          this.snackBar.open("Please select a sku to modify", "close", {
            duration: 2000,
          });
        }
        else if (counter != 1) 
        {
          this.snackBar.open("Please only select one sku to modify", "close", {
            duration: 2000,
          });
        }
        else{
            this.data.forEach(user => {
              if (user.checked) {
                this.modifySkuConfirmed(user.name, user.skuNumber, user.caseUpcNumber, user.unitUpcNumber, user.unitSize, user.countPerCase, user.productLine, user.ingredientTuples, user.comment, user.id);
              }
            });
          }   
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
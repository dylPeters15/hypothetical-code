import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
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
export class IngredientInventoryComponent  implements OnInit {

  constructor(public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }
  allReplacement = 54321;
  displayedColumns: string[] = ['checked', 'name', 'number','vendorInformation', 'packageSize', 'costPerPackage', 'comment'];
  data: UserForTable[] = [];
  dialogRef: MatDialogRef<MoreInfoDialogComponent>;
  newDialogRef: MatDialogRef<NewSkuDialogComponent>;
  dataSource =  new MatTableDataSource<UserForTable>(this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.refreshData();
  }

  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  refreshData() {
    this.rest.getIngredients().subscribe(response => {
      this.data = response;
      this.data.forEach(user => {
        user['checked'] = false;
      });
      console.log("got here. data is: " + this.data);
      this.sortData();
      this.dataSource =  new MatTableDataSource<UserForTable>(this.data);
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

  deleteSkuConfirmed(name) {
    this.rest.sendAdminDeleteSkuRequest(name).subscribe(response => {
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
        this.data.forEach(user => {
          if (user.checked) {
            this.deleteSkuConfirmed(user.name);
          }
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
import {Component, OnInit, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { RestService } from '../rest.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ModifyNameDialogComponent } from './modify-name-dialog.component';
import { DeletePLDialogComponent } from './delete-product-line-dialog.component';

export interface DataForTable {
  productlinename: String,
  skus: []
}

/**
 * @title Drag&Drop sorting
 */
@Component({
  selector: 'app-product-line',
  templateUrl: 'product-line.component.html',
  styleUrls: ['product-line.component.css'],
})
export class ProductLineComponent implements OnInit {

  allReplacement = 54321;
  constructor(public rest: RestService, private snackBar: MatSnackBar, private dialog: MatDialog, public router: Router) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterQuery: string = "";
  data: DataForTable[] = [];
  dataSource = new MatTableDataSource<DataForTable>(this.data);

  ngOnInit() {
    // this.paginator.pageSize = 20;
    // this.paginator.page.subscribe(event => {
    //   // this.deselectAll();
    // });
    this.refreshData();
  }

  getPageSizeOptions() {
    return [20, 50, 100, this.allReplacement];
  }

  refreshData(filterQueryData?) {
    // filterQueryData = filterQueryData ? "^"+filterQueryData+".*" : "^"+this.filterQuery+".*"; //this returns things that start with the pattern
    filterQueryData = filterQueryData ? ".*"+filterQueryData+".*" : ".*"+this.filterQuery+".*"; //this returns things that have the pattern anywhere in the string
    this.rest.getProductLines("", filterQueryData, 10).subscribe(response => {
      this.data = response;
      // this.deselectAll();
      this.sortData();
      this.dataSource = new MatTableDataSource<DataForTable>(this.data);
      // this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data)
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(ModifyNameDialogComponent, {
        width: '250px',
        data: {}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.data['productlinename'] = result;
        return new Promise((resolve, reject) => {
          this.rest.createProductLine(result, []).subscribe(results => {
            if (results != null) {
              console.log(results)
            }
            this.refreshData();
            resolve();
          })
        })
      });
  }

  deleteProductLine() {
    const dialogRef = this.dialog.open(DeletePLDialogComponent, {
        width: '250px',
        data: this.dataSource.data,
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.refreshData();
      });
  }

  sortData() {
    this.data.sort((a, b) => {
      return a.productlinename > b.productlinename ? 1 : -1;
    });
  }
}
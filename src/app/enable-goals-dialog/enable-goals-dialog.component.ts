import {Component, OnInit, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { RestService } from '../rest.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';


export class DataForTable {
  enabled: String;
  goals: []

  constructor(enabled, goals){
    this.enabled = enabled;
    this.goals = goals;
  }
}

/**
 * @title Drag&Drop sorting
 */
@Component({
  selector: 'app-enable-goals-dialog',
  templateUrl: 'enable-goals-dialog.component.html',
  styleUrls: ['enable-goals-dialog.component.css'],
})
export class EnableGoalsDialogComponent implements OnInit {

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

  refreshData() {
    // filterQueryData = filterQueryData ? "^"+filterQueryData+".*" : "^"+this.filterQuery+".*"; //this returns things that start with the pattern
      this.rest.getGoals(null, "", "", true, 5).subscribe(enabledGoals => {
        let enabledGoalsList = [];
        console.log("ENABLED:" + JSON.stringify(enabledGoals))
      //   enabledGoals.forEach(enabledGoal => {
      //     console.log("IS IT ENABLED: " + enabledGoal['enabled'])
      //     enabledGoalsList.push(enabledGoal['goalname']);
      //   })
      //   let enabledGoalsTable = new DataForTable("Enabled", enabledGoalsList)
      //   console.log("ENABLED: " + JSON.stringify(enabledGoalsTable))
      //   this.data.push(enabledGoalsTable)
      //   this.rest.getGoals("", "", "", false, 5).subscribe(disabledGoals => {
      //     let disabledGoalsList = [];
      //     disabledGoals.forEach(disabledGoal => {
      //       console.log("IS IT ENABLED: " + disabledGoal['enabled'])
      //       disabledGoalsList.push(disabledGoal['goalname'])
      //     });
      //     let disabledGoalsTable = new DataForTable("Disabled", disabledGoalsList)
      //     console.log("DISABLED: " + JSON.stringify(disabledGoalsTable))
      //     this.data.push(disabledGoalsTable)
      //           // this.sortData();
      //     this.dataSource = new MatTableDataSource<DataForTable>(this.data);
      // // this.dataSource.paginator = this.paginator;
      //     console.log(this.dataSource.data)
        // });
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

  // openDialog() {
  //   const dialogRef = this.dialog.open(NewProductLineDialogComponent, {
  //     width: '250px',
  //     data: {}
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     if (result) {
  //       this.data['productlinename'] = result;
  //       return new Promise((resolve, reject) => {
  //         this.rest.createProductLine(result, []).subscribe(results => {
  //           if (results != null) {
  //             console.log(results)
  //           }
  //           this.refreshData();
  //           resolve();
  //         })
  //       })
  //     }
  //   });
  // }

  // deleteProductLine() {
  //   const dialogRef = this.dialog.open(DeleteProductLineDialogComponent, {
  //       width: '250px',
  //       data: this.dataSource.data,
  //       disableClose: true
  //     });
  
  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log('The dialog was closed');
  //       this.refreshData();
  //     });
  // }

  // sortData() {
  //   this.data.sort((a, b) => {
  //     return a.productlinename > b.productlinename ? 1 : -1;
  //   });
  // }
}
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
    this.rest.getUserName().then(result => {
      this.rest.getGoals(result.toString(), "", "", true, 5).subscribe(goals => {
        let enabledGoalsList = [];
        let disabledGoalsList = [];
        goals.forEach(goal => {
          if(goal['enabled'] == true){
            enabledGoalsList.push(goal);
          }
          else{
            disabledGoalsList.push(goal);
          }
        })
        let enabledGoalsTable = new DataForTable("Enabled", enabledGoalsList)
        this.data.push(enabledGoalsTable)
          let disabledGoalsTable = new DataForTable("Disabled", disabledGoalsList)
          this.data.push(disabledGoalsTable)
          this.dataSource = new MatTableDataSource<DataForTable>(this.data);
          console.log(this.dataSource.data)
      });

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
import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EnableGoalsDialogComponent } from '../enable-goals-dialog/enable-goals-dialog.component'
import { ModifyActivityDialogComponent } from '../modify-activity-dialog/modify-activity-dialog.component'
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource,MatPaginator, MatSnackBar } from "@angular/material";
import {ExportToCsv} from 'export-to-csv';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

export class DataForGoalsTable{
  goalname: string;
  activities: [];
  constructor(goalname, activities){
    this.goalname = goalname;
    this.activities = activities;
  }
}

@Component({
  selector: 'app-manufacturing-schedule',
  templateUrl: './manufacturing-schedule.component.html',
  styleUrls: ['./manufacturing-schedule.component.css']
})
export class ManufacturingScheduleComponent implements OnInit {
  enableGoalsDialogRef: MatDialogRef<EnableGoalsDialogComponent>;
  modifyActivityDialogRef: MatDialogRef<ModifyActivityDialogComponent>;
  goalsData: DataForGoalsTable[] = [];
  dataSource = new MatTableDataSource<DataForGoalsTable>(this.goalsData);

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    this.refreshData();


  }


  refreshData() {
    this.goalsData = [];
    this.rest.getUserName().then(result => {
        this.rest.getGoals(result.toString(), "", "", true, 5).subscribe(goals => {
          goals.forEach(goal => {
            let activityList = [];
            if(goal['enabled']){
            goal['activities'].forEach(activity => {
              activityList.push(activity['activity'])
            })
            
                
            let goalTable = new DataForGoalsTable(goal['goalname'], activityList)
            this.goalsData.push(goalTable)
            }

            
        });
        this.dataSource = new MatTableDataSource<DataForGoalsTable>(this.goalsData);
  
      });
    
  })
}
  modifySelectedActivity(activity) {
    this.modifyManufacturingActivityConfirmed(activity); 
    }

    modifyManufacturingActivityConfirmed(activity) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {activity: activity};
      this.modifyActivityDialogRef = this.dialog.open(ModifyActivityDialogComponent, dialogConfig);
      this.modifyActivityDialogRef.afterClosed().subscribe(event => {
        this.refreshData();
      });
    }



  openEnableGoalsDialog() {
    const dialogConfig = new MatDialogConfig();
    this.enableGoalsDialogRef = this.dialog.open(EnableGoalsDialogComponent, dialogConfig);
    this.enableGoalsDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
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
}

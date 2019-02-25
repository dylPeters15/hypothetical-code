import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EnableGoalsDialogComponent } from '../enable-goals-dialog/enable-goals-dialog.component'
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

export class DataForLinesTable{
  shortname: string;
  activities: [];
  constructor(shortname, activities){
    this.shortname = shortname;
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
  goalsData: DataForGoalsTable[] = [];
  goalsDataSource = new MatTableDataSource<DataForGoalsTable>(this.goalsData);
  startDate: Date = new Date();
  endDate: Date = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear()+1));
  linesData: DataForLinesTable[] =[];
  linesDataSource = new MatTableDataSource<DataForLinesTable>(this.linesData);

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
        this.goalsDataSource = new MatTableDataSource<DataForGoalsTable>(this.goalsData);
        console.log(this.goalsDataSource)
      });
  })
  this.linesData = [];
  this.rest.getLine('','.*','','.*',100).subscribe(response => {
    response.forEach(line => {
      var currentLineName = line['shortname'];
      let currentActivities = [];
      this.rest.getActivities(null,100,line['_id']).subscribe(activities => {
        if(activities.length > 0){
          currentActivities.push(activities);
        }
        let newLine = new DataForLinesTable(currentLineName, currentActivities);
        this.linesData.push(newLine);
      })
      console.log(this.linesData)
      this.linesDataSource = new MatTableDataSource<DataForLinesTable>(this.linesData);
    })
    

  })
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
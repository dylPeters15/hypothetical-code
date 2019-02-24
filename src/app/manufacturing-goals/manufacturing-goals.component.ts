import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewGoalDialogComponent } from '../new-goal-dialog/new-goal-dialog.component'
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource,MatPaginator, MatSnackBar } from "@angular/material";
import {ExportToCsv} from 'export-to-csv';
import { auth } from '../auth.service';
import { from } from 'rxjs';

export class ManufacturingGoal {
  activities: String;
  activityCount: number;
  name: String;
  date: Date;
  checked: boolean;
  constructor(name, activities, activityCount, date, checked){
    this.activityCount = activityCount;
    this.name = name;
    this.activities = activities;
    this.date = date;
    this.checked = checked;
  }
}

export class ExportableGoal {
  activities: String;
  name: String;
  date: String;
  constructor(activities, name, date){
    this.name = name;
    this.activities = activities;
    this.date = date;
  }
}

@Component({
  selector: 'app-manufacturing-goals',
  templateUrl: './manufacturing-goals.component.html',
  styleUrls: ['./manufacturing-goals.component.css']
})

export class ManufacturingGoalsComponent implements OnInit {
  allReplacement = 54321;
  goals:any = [];
  displayedColumns: string[] = ['checked', 'name', 'activities', 'date', 'export', 'actions'];
  data: ManufacturingGoal[] = [];
  dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  newDialogRef: MatDialogRef<NewGoalDialogComponent>;

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {  }

  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  newGoal() {
    this.newManufacturingGoal(false, "","","");
}

  ngOnInit() {
    this.refreshData();

  }

  refreshData() {
    this.data = [];
    this.rest.getUserName().then(result => {
      this.rest.getGoals(result.toString(), "", ".*", true, 5).subscribe(data => {
        this.goals = data;
        this.rest.getGoals(result.toString(), "", ".*", false, 5).subscribe(data => {
            this.goals.push(data);
            var i;
            this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
            for(i = 0; i<this.goals.length; i++){
              let name = this.goals[i]['goalname'];
              let activities = this.goals[i]['activities'];
              var j;
              let activityCount = activities.length;
              let activityString = '';
              for(j = 0; j<activities.length; j++){
              let currentActivity =  activities[j]['activity']
                  activityString += "SKU: " + currentActivity['sku']['skuname'] + " Hours Required: " + currentActivity['calculatedhours'] + '\n'; 
              }
              let date = this.goals[i]['date'];
              let currentGoal = new ManufacturingGoal(name, activityString, activityCount, date, false);
              this.data.push(currentGoal);
            }
            this.data.forEach(element => {
              element['checked'] = false;
            });
            this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
            this.dataSource.paginator = this.paginator;
        })
      })
    })
    
  }

  deleteSelected() {
    const dialogConfig = new MatDialogConfig();
        this.data.forEach(goal => {
          if (goal.checked) {
            this.deleteGoalConfirmed(goal.name);
          }
        });
  }

  deleteGoalConfirmed(name) {
    this.rest.deleteGoal(name).subscribe(response => {
      this.snackBar.open("Goal: " + name + " deleted successfully.", "close", {
        duration: 2000,
      });
      this.data = this.data.filter((value, index, arr) => {
        return value.name != name;
      });
      this.refreshData();
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

  exportToCsv(goal) {
    let toExport: ExportableGoal[] = [];
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'Manufacturing Goal',
      useTextFile: false,
      useBom: true,
      headers: ["Name", "Activities", "Date"]
    };
    
    let goalToExport = new ExportableGoal(goal.activities, goal.name, goal.date);
    toExport.push(goalToExport);
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(toExport);
  }

  newManufacturingGoal(edit, present_name, present_activities, present_date) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {edit: edit, present_name: present_name, present_activities: present_activities, present_date:present_date };
    this.newDialogRef = this.dialog.open(NewGoalDialogComponent, dialogConfig);
    this.newDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  modifySelected(goal) {
    this.modifyManufacturingGoal(goal.name, goal.activities, goal.date)
  }

    modifyManufacturingGoal(present_goalname, present_activities, present_date) {
      this.newManufacturingGoal(true, present_goalname, present_activities, present_date);
    }

}

import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewGoalDialogComponent, DisplayableActivity } from '../new-goal-dialog/new-goal-dialog.component'
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource,MatPaginator, MatSnackBar } from "@angular/material";
import {ExportToCsv} from 'export-to-csv';
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { auth } from '../auth.service';
import { from } from 'rxjs';

export class ManufacturingGoal {
  activities: String;
  activityCount: number;
  name: String;
  date: String;
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

  constructor(public restv2: RestServiceV2,public rest:RestService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {  }

  getPageSizeOptions() {
    return [20, 50, 100, this.allReplacement];
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

  newGoal() {
    this.newManufacturingGoal(false, "","","");
}

  ngOnInit() {
    this.refreshData();

  }

  refreshData() {
    this.data = [];
    this.rest.getUserName().then(result => {
      console.log("USERNAME: " + result.toString());
      this.restv2.getGoals(AndVsOr.OR, result.toString(), null,null, null, 150).then(data => {
        this.goals = data;
            var i;
            this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
            for(i = 0; i<this.goals.length; i++){
              let name = this.goals[i]['goalname'];
              let activities = this.goals[i]['activities'];
              if(activities != undefined){
                console.log("ACTIVITES: " + JSON.stringify(activities))
                var j;
                let activityCount = activities.length;
                let activityString = '';
                for(j = 0; j<activities.length; j++){                  
                  let currentActivity =  activities[j]['activity']
                  console.log("Activity: " + JSON.stringify(currentActivity))
                  if(currentActivity != null && currentActivity != undefined){
                    let hoursString = currentActivity['sethours'] != null ? currentActivity['sethours'] : currentActivity['calculatedhours'];
                    activityString += "SKU: " + currentActivity['sku']['skuname'] + ": Hours Required: " + hoursString + '\n'; 
                  }
                 
                }
                activityString = activityString.substring(0,activityString.length-1)
                let date = new Date(this.goals[i]['date']);
                let dateString = date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear();
                let currentGoal = new ManufacturingGoal(name, activityString, activityCount, dateString, false);
                this.data.push(currentGoal);
              }
              
         
            }
            this.data.forEach(element => {
              element['checked'] = false;
            });
            this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
            this.dataSource.paginator = this.paginator;
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
    let displayableArray: DisplayableActivity[] = [];
    if(goal.activities != ""){
      let activitiesArray = goal.activities.split(':').join('\n').split('\n');
      var i;
      for(i = 0; i<activitiesArray.length; i+=4){
        let currentActivity = new DisplayableActivity(activitiesArray[i+3].trim(), activitiesArray[i+1].trim())
        if(currentActivity != null){
          displayableArray.push(currentActivity);
        }
        
      }
    }
   
    this.modifyManufacturingGoal(goal.name, displayableArray, goal.date)
  }

    modifyManufacturingGoal(present_goalname, present_activities, present_date) {
      this.newManufacturingGoal(true, present_goalname, present_activities, present_date);
    }
  


  noneSelected(): boolean {
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].checked) {
        return false;
      }
    }
    return true;
  }

}

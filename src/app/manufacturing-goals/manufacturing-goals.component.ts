import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewGoalDialogComponent} from '../new-goal-dialog/new-goal-dialog.component'
import {ManufacturingCalculatorComponent} from '../manufacturing-calculator/manufacturing-calculator.component'
import { MatDialogRef, MatDialog, MatDialogConfig, MatSort, MatTableDataSource,MatPaginator, MatSnackBar } from "@angular/material";
import {ExportToCsv} from 'export-to-csv';
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { auth } from '../auth.service';
import { from } from 'rxjs';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';
import { EnableGoalsDialogComponent } from '../enable-goals-dialog/enable-goals-dialog.component';

export class ManufacturingGoal {
  activities: any[];
  activityCount: number;
  name: String;
  date: String;
  owner: String;
  lastedit: String;
  enabled: boolean;
  constructor(name, activities, activityCount, date, enabled, owner, lastedit){
    this.activityCount = activityCount;
    this.name = name;
    this.activities = activities;
    this.date = date;
    this.enabled = enabled;
    this.owner = owner;
    this.lastedit = lastedit;
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
  businessmanager: boolean = false;
  allReplacement = 54321;
  goals:any = [];
  displayedColumns: string[] = [];
  data: ManufacturingGoal[] = [];
  dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  newDialogRef: MatDialogRef<NewGoalDialogComponent>;
  calculatorDialogRef: MatDialogRef<ManufacturingCalculatorComponent>;
  activityDialogRef: MatDialogRef<ActivityDetailsComponent>;
  enableGoalsDialogRef: MatDialogRef<EnableGoalsDialogComponent>;


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
    this.newManufacturingGoal(false, "","","", false);
}

  ngOnInit() {
    this.businessmanager = auth.isAuthenticatedForBusinessManagerOperation();
    if(this.businessmanager){
      this.displayedColumns = ['checked', 'name','owner', 'activities', 'date', 'calculator','lastedit', 'edit', 'delete', 'export'];
    }
    else{
      this.displayedColumns = ['checked', 'name','owner', 'activities', 'date', 'calculator','lastedit', 'export'];
    }
    this.refreshData();

  }

  refreshData() {
    this.data = [];
      this.restv2.getGoals(AndVsOr.OR, null, null,".*", null, 150).then(data => {
        this.goals = data;
            var i;
            this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
            for(i = 0; i<this.goals.length; i++){
              let name = this.goals[i]['goalname'];
              let activities = this.goals[i]['activities'];
              let owner = this.goals[i]['owner']['username'];
              let enabled = this.goals[i]['enabled'];
              if(activities != undefined){
                let goalActivities = [];
                var j;
                let activityCount = activities.length;
                let activityString = '';
                for(j = 0; j<activities.length; j++){                  
                  let currentActivity =  activities[j]['activity']
                  goalActivities.push(currentActivity);
                  // if(currentActivity != null && currentActivity != undefined){
                  //   let hoursString = currentActivity['sethours'] != null ? currentActivity['sethours'] : currentActivity['calculatedhours'];
                  //   activityString += "SKU: " + currentActivity['sku']['skuname'] + ": Hours Required: " + hoursString + '\n'; 
                  // }
                 
                }
                activityString = activityString.substring(0,activityString.length-1)
                let date = new Date(this.goals[i]['date']);
                let dateString = date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear();
                let lasteditdate = new Date(this.goals[i]['lastedit'])
                let lasteditDateString = lasteditdate.getMonth()+1 + '/' + lasteditdate.getDate() + '/' + lasteditdate.getFullYear();
                let currentGoal = new ManufacturingGoal(name, goalActivities, activityCount, dateString, enabled, owner, lasteditDateString);
                this.data.push(currentGoal);
              }
              
         
            }
            this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        })
    
  }

  deleteSelected(goal) {
    this.deleteGoalConfirmed(goal.name);
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

  newManufacturingGoal(edit, present_name, present_activities, present_date, present_enabled) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {edit: edit, present_name: present_name, present_activities: present_activities, present_date:present_date, present_enabled:present_enabled };
    this.newDialogRef = this.dialog.open(NewGoalDialogComponent, dialogConfig);
    this.newDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  async showCalculator(goal){
    const dialogConfig = new MatDialogConfig();
    var actualGoal = await this.restv2.getGoals(AndVsOr.OR, null, goal['name'], null,null,1);
    dialogConfig.data = {goal: actualGoal};
    this.calculatorDialogRef = this.dialog.open(ManufacturingCalculatorComponent, dialogConfig);
    this.calculatorDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  modifySelected(goal) {
   
    this.modifyManufacturingGoal(goal.name, goal.activities, goal.date, goal.enabled)
  }

    modifyManufacturingGoal(present_goalname, present_activities, present_date, present_enabled) {
      this.newManufacturingGoal(true, present_goalname, present_activities, present_date, present_enabled);
    }

  async showActivityDetails(goal){
    const dialogConfig = new MatDialogConfig();
    var actualGoal = await this.restv2.getGoals(AndVsOr.OR, null, goal['name'], null,null,1);
    dialogConfig.data = {goal: actualGoal};
    this.activityDialogRef = this.dialog.open(ActivityDetailsComponent, dialogConfig);
    this.activityDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  async openEnableGoalsDialog(): Promise<void> {
    const dialogConfig = new MatDialogConfig();
    this.enableGoalsDialogRef = this.dialog.open(EnableGoalsDialogComponent, dialogConfig);
    this.enableGoalsDialogRef.afterClosed().subscribe(async event => {
      this.refreshData();
    })
  }

  sortData() {
    this.data.sort((a,b) => {
      return a.name > b.name ? 1 : -1;
    });
  }

}

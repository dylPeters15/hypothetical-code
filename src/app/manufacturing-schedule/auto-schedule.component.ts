import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import {FormControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { auth } from '../auth.service';
import { LineToLineMappedSource } from 'webpack-sources';

export class ActivityData {
    selected: Boolean;
    name: string;
    activity: Object;
    goalName: string

    constructor(name, activity, goalName) {
        this.selected = false;
        this.name = name;
        this.activity = activity;
        this.goalName = goalName
    }
}

@Component({
    selector: 'app-auto-schedule',
    templateUrl: './auto-schedule.component.html',
    styleUrls: ['./auto-schedule.component.css']
})

export class AutoScheduleComponent implements OnInit {

    allReplacement = 54321;
    constructor(public restv2: RestServiceV2, private snackBar: MatSnackBar, private dialog: MatDialog, public router: Router, private dialogRef: MatDialogRef<AutoScheduleComponent>) { }
    @ViewChild(MatPaginator) paginator: MatPaginator;
    filterQuery: string = "";
    data: ActivityData[] = [];
    dataSource = new MatTableDataSource<ActivityData>(this.data);
    displayedColumns: string[] = ['selected', 'activityInfo'];
    minDate = new Date(1970, 0, 1);
    maxDate = new Date(2100, 0, 1);
    startDate = new FormControl(new Date());
    endDate = new FormControl(new Date());
    startSet: Boolean = false;
    endSet: Boolean = false;
    unscheduledActivityList: any[] = [];
    scheduledActivityList: any[] = [];
    manufacturingLinesToManage: any[] = [];

    ngOnInit() {
        // this.paginator.pageSize = 20;
        // this.paginator.page.subscribe(event => {
        //   // this.deselectAll();
        // });
        this.refreshMLs();
        this.refreshData();
    }

    async refreshData(): Promise<void> {
        this.data = [];
        var goals = await this.restv2.getGoals(AndVsOr.OR, null, "", "", true, 100);
        console.log(goals, 'goals');
        goals.forEach(goal => {
            if (goal['enabled']) {
                goal['activities'].forEach(activity => {
                    console.log('activity', activity)
                    if (activity['activity']['line'] == null || activity['activity']['line'] == undefined) {
                        console.log('add to table')
                        this.unscheduledActivityList.push(activity['activity']);
                        let activityTable = new ActivityData(activity['activity']['sku']['skuname'], activity['activity'], goal['goalname'])
                        this.data.push(activityTable)
                    }
                    else {
                        this.scheduledActivityList.push(activity['activity']);
                    }
                });
                
            }
        })
        console.log('activity data', this.data)
        this.dataSource =  new MatTableDataSource<ActivityData>(this.data);
    }

    setStart(event: MatDatepickerInputEvent<Date>) {
        this.minDate = event.value;
        this.startSet = true;
    }

    setEnd(event: MatDatepickerInputEvent<Date>) {
        this.maxDate = event.value;
        this.endSet = true;
    }

    async createSchedule(): Promise<void> {
        var selectedActivities: any[] = [];
        var thisObject = this;
        var wait = new Promise((resolve, reject) => {
            this.data.forEach(async (activity, index, array) => {
                var goal = await this.restv2.getGoals(AndVsOr.OR, null, 
                    activity['goalName'], null, true, 1);
                if (goal.length == 1) {
                    console.log('goal and activity', goal[0], activity)
                    if (activity.selected == true) {
                        console.log('is selected', activity.selected)
                        var deadline = new Date(goal[0]['date']);
                        console.log('deadline', deadline)
                        selectedActivities.push([deadline, activity['activity']['calculatedhours'], activity['activity']]);    
                    }
                    if (index === array.length -1) resolve();
                }  
            })
        });
        wait.then(async () => {
            selectedActivities.sort(thisObject.sortFunction)
            console.log('selectedActivities sorted', selectedActivities)
            selectedActivities.forEach(async (activity) => {
                this.getValidLines(activity).then(potentialLines => {
                    console.log(potentialLines);
                    
                })
            })
        })
        


        this.dialogRef.close();
    }

    sortFunction(a, b) {
        if (a[0].valueOf() === b[0].valueOf()) {
            if (a[1] === b[1]) {
                return -1;
            }
            else {
                return (a[1] < b[1]) ? -1 : 1;
            }
        }
        else {
            return (a[0].valueOf() < b[0].valueOf()) ? -1 : 1;
        }
    }

    async getValidLines(activity): Promise<any> {
        var potentialLines = []
        this.manufacturingLinesToManage.forEach(line => {    
            console.log('line with access', line)
            var sku = activity[2]['sku']; 
            console.log('sku', sku);
            var lineSkus = []
            line['manufacturingline']['skus'].forEach(lineSku => {    
                lineSkus.push(lineSku['sku']);
            })
            if (lineSkus.includes(sku['_id'])) {
                potentialLines.push(line);
            }
            console.log('potentialLines', potentialLines)
        })  
        console.log('final line')
        return potentialLines
    }
 
    deselectAll() {
        this.data.forEach(activity => {
            activity.selected = false;
        });
    }

    selectAll() {
        this.data.forEach(activity => {
            activity.selected = true;
        });
    }

    closeDialog() {
        this.dialogRef.close();
    }

    checkValid(): boolean {
        var isSelected = false;
        this.data.forEach(activity => {
            if(activity.selected) {
                isSelected = true;
            }
        })
        if (this.startSet && this.endSet && isSelected) {
            return false;
        }
        else {
            return true;
        }
    }

    async refreshMLs(): Promise<void> {
        var thisobject = this;
        var users = await thisobject.restv2.getUsers(AndVsOr.AND, auth.getUsername(), null, null, null, null, null, null, auth.getLocal(), 1);
        if (users.length == 1) {
        //   this.manufacturingLinesToManage = [];
        //   users[0].manufacturinglinestomanage.forEach(line => {
        //       this.manufacturingLinesToManage.push(line['manufacturingschedule']['_id'])
        //   });
        this.manufacturingLinesToManage = users[0].manufacturinglinestomanage;
        console.log(this.manufacturingLinesToManage)
        }
    }
}
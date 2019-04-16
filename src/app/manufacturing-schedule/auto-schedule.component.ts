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
import { invalid } from 'moment';

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
    startDate = new Date(1970, 0, 1);
    endDate = new Date(2100, 0, 1);
    startSet: Boolean = false;
    endSet: Boolean = false;
    unscheduledActivityList: any[] = [];
    scheduledActivityList: any[] = [];
    manufacturingLinesToManage: any[] = [];
    invalidActivities: any[] = [];
    validActivities: any[] = [];

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
        this.startDate = event.value;
        this.startDate.setHours(this.startDate.getHours() + 8)
        this.startSet = true;
    }

    setEnd(event: MatDatepickerInputEvent<Date>) {
        this.endDate = event.value;
        this.endDate.setHours(this.startDate.getHours() + 18)
        this.endSet = true;
    }

    async confirm(): Promise<void> {
        await this.createSchedule()

        console.log('valid activities', this.validActivities)
        console.log('invalid activities', this.invalidActivities)
        if (this.invalidActivities.length > 0) {
            this.snackBar.open("Unable to schedule activities " + this.invalidActivities, "close", {
                duration: 4000,
            });
        }
        this.dialogRef.close({newActivities:this.validActivities});
    }

    async createSchedule(): Promise<void> {
        var selectedActivities: any[] = [];
        var thisObject = this;
        
        console.log('endDate', this.endDate);
        await new Promise((resolve, reject) => {
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
        ///////
        
        selectedActivities.sort(thisObject.sortFunction)
        console.log('selectedActivities sorted', selectedActivities)
        for (const activity of selectedActivities) {
        await new Promise(async (resolve, reject) => {
            this.getValidLines(activity).then(async potentialLines => {
                var temp = new Date(this.endDate)
                // temp.setDate(temp.getDate()+1)
                console.log(temp)
                var newLine: Object;
                console.log(potentialLines)
                await new Promise(async (resolve, reject) => {
                    potentialLines.forEach(async (line, index, array) => {
                        // potentialLines.forEach(line => {
                        this.findValidStart(activity[2], line['_id'], this.startDate).then(potDates => {
                            console.log(potDates, temp)
                            if (potDates[1].valueOf() <= temp.valueOf()) {
                                temp = potDates[0];
                                newLine = line;
                            }
                            if (index === array.length -1) resolve();
                        })
                    })
                })
                    console.log('modifyActivty')
                    console.log('newLine', newLine)
                    if (newLine) {
                        console.log('original activity', activity)
                        var tempActivity = activity[2];
                        tempActivity['startdate'] = new Date(temp);
                        tempActivity['line'] = newLine['_id'];
                        this.validActivities.push(tempActivity);
                        resolve();
                        console.log('original activity', activity, 'new activity', tempActivity)

                    }
                    else {
                        this.invalidActivities.push(activity[2]['sku']['skuname']);
                        console.log('could not schedule activity', activity[2])
                        resolve();
                    }
                })
            })
                console.log('next activity')    
        }
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
                potentialLines.push(line['manufacturingline']);
            }
            console.log('potentialLines', potentialLines)
        })  
        console.log('final line')
        return potentialLines
    }

    async findValidStart(activity, line, start: Date): Promise<Date[]> {
        var returnDate: Date;
        var potS = start.valueOf();
        var potE = this.calculateEndDate(start, activity['calculatedhours']).valueOf();
        console.log('potential dates', new Date(potS), new Date(potE))
        var activities = await this.restv2.getActivities(AndVsOr.OR, null, line, null, 100);
        console.log('activities', activities)
        console.log(this.validActivities) 
        // need to add one by one
        this.validActivities.forEach(activity => {
            if (activity['line'] == line) {
                activities.push(activity)
            }
        })
        if (activities.length > 0) {
            while (returnDate == null) {
                var isValid = true;
                var minActivityEnd = (new Date(2100, 0, 1)).valueOf();
                console.log('potential dates', new Date(potS), new Date(potE))
                activities.forEach(setActivity => {
                    console.log('activity', setActivity)
                    var startValue = (new Date(setActivity['startdate'])).valueOf();
                    var duration = setActivity['calculatedhours'];
                    if (setActivity['sethours']) {
                        duration = setActivity['sethours']
                    }
                    var endValue = this.calculateEndDate(new Date(setActivity['startdate']), duration).valueOf()
                    console.log('scheduled activity', duration, new Date(startValue), new Date(endValue))
                    if (potS <= startValue && potE >= startValue) {
                        console.log('invalid')
                        isValid = false;
                        if (endValue < minActivityEnd && startValue >= potS) {
                            minActivityEnd = endValue;
                        }
                    }
                    else if (potS >= startValue && potS <= endValue) {
                        isValid = false;
                        if (endValue < minActivityEnd && startValue >= potS) {
                            minActivityEnd = endValue;
                        }
                    }
                })
                if (isValid) {
                    returnDate = new Date(potS);
                }
                else {
                    var minEndDate = new Date(minActivityEnd);
                    minEndDate.setHours(minEndDate.getHours() + 1);
                    var potS = minEndDate.valueOf();
                    var potE = this.calculateEndDate(minEndDate, activity['calculatedhours']).valueOf();
                }
            }
            return [returnDate, this.calculateEndDate(returnDate, activity['calculatedhours'])];   
        }
        else {
            console.log('no activities')
            return [start, this.calculateEndDate(start, activity['calculatedhours'])];
        }   
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

    calculateEndDate(startDate: Date, hours: number): Date {
        var endDate = new Date(startDate) 
        var extraDays = Math.floor(hours / 10);
        endDate.setDate(endDate.getDate() + extraDays);
        endDate.setHours(endDate.getHours() + (hours % 10))
        var endHour = endDate.getHours();
        if (endHour > 18 || endHour < 8) {
            endDate.setHours(endHour + 14);
        }
        return endDate;
        
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
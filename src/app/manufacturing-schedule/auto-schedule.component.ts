import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import {FormControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

export class ActivityData {
    selected: Boolean;
    name: String;
    id: Object;
    goalName: String

    constructor(name, id, goalName) {
        this.selected = false;
        this.name = name;
        this.id = id;
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

    ngOnInit() {
        // this.paginator.pageSize = 20;
        // this.paginator.page.subscribe(event => {
        //   // this.deselectAll();
        // });
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
                        let activityTable = new ActivityData(activity['activity']['sku']['skuname'], ['activity']['_id'], goal['goalname'])
                        this.data.push(activityTable)
                    }
                });
                
            }
        })
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

    createSchedule() {


        this.dialogRef.close();
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
        if (this.startSet && this.endSet) {
            return false;
        }
        else {
            return true;
        }
    }
}
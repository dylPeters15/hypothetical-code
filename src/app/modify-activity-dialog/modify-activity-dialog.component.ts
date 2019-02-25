
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatDatepickerInputEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';


@Component({
  selector: 'app-modify-activity-dialog',
  templateUrl: './modify-activity-dialog.component.html',
  styleUrls: ['./modify-activity-dialog.component.css']
})

export class ModifyActivityDialogComponent implements OnInit {

  activityName: string;
  calculatedHours: number;
  setHours: number;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ModifyActivityDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { 
    console.log("DATA: " + JSON.stringify(this.data))
  }

  ngOnInit() {
    this.activityName = this.data['activity']['sku']['skuname'];
    this.calculatedHours = this.data['activity']['calculatedhours'];
    this.setHours = this.data['activity']['sethours'];
  }

  closeDialog() {
    this.dialogRef.close();
  }

  // addActivity(){
  //   var hours = this.quantity/this.currentSku['manufacturingrate'];
  //   let newActivity = new DisplayableActivity(hours, this.currentSku['skuname']);
  //   this.displayableActivities.push(newActivity);
  //   this.rest.createActivity(this.currentSku['_id'], this.quantity, hours, null,new Date(),null).subscribe(response => {
  //     this.activityIds.push({activity: response['_id']});
  //     this.snackBar.open("Successfully created Activity: " + this.currentSku['skuname'] + ".", "close", {
  //             duration: 2000,
  //           });
  //   });
  // }

  modifyActivity() {
    let activity = this.data['activity'];
    console.log("ACTIVITY: " + JSON.stringify(activity))
      this.rest.modifyActivity(activity['sku']['_id'],activity['sku']['_id'],activity['numcases'],activity['calculatedhours'], Number(this.setHours),activity['startdate'],activity['line']).subscribe(response => {
        console.log("EDITED: " + JSON.stringify(response))
        this.snackBar.open("Successfully modified Activity for SKU: " + activity['sku']['skuname'] + ".", "close", {
          duration: 2000,
        });
        this.closeDialog();
      });
  }
}

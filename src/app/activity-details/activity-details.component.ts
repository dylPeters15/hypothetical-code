import { Component, OnInit,ViewChild, ElementRef, Inject  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ExportToCsv} from 'export-to-csv';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css']
})
export class ActivityDetailsComponent implements OnInit {
  goal: any;
  activities: any[] = [];
  activityStrings: string[] = [];
constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<ActivityDetailsComponent>, public rest:RestService, private route: ActivatedRoute, private router: Router)  { }

  ngOnInit() {
    this.goal = this.data.goal[0];
    this.createStrings(this.goal['activities'])
  }

  createStrings(activitiesList){
    this.activityStrings = [];
    this.activities = [];
    var i;
    for(i = 0; i<activitiesList.length; i++){
      let currentActivity = activitiesList[i]['activity'];
      if(this.activities.indexOf(currentActivity) == -1){
        this.activities.push(currentActivity);
        let sku = currentActivity['sku'];
        let skustring = this.printSKU(sku);
        let hours = currentActivity['sethours'] != null ? currentActivity['sethours'] : currentActivity['calculatedhours'];
        
        let activityString = skustring + " Hours: " + hours;
        this.activityStrings.push(activityString);
      }
    }
  }

  printSKU(skuObject){
    let sku = '';
    sku += skuObject['skuname'] + ': ' + skuObject['unitsize'] + ' * ' + skuObject['countpercase'] + ' ' + '(' + skuObject['skunumber'] + ')';
    return sku;
}

closeDialog() {
  this.dialogRef.close();
  this.activityStrings = null;
}


}

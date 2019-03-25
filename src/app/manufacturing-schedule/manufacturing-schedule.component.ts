import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as vis from 'vis';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource,MatPaginator, MatSnackBar } from "@angular/material";
import { EnableGoalsDialogComponent } from '../enable-goals-dialog/enable-goals-dialog.component'
import { RestService } from '../rest.service';
import { RestServiceV2, AndVsOr } from '../restv2.service';

var moment = require('moment');     //please note that you should include moment library first
require('moment-weekday-calc');

export class DataForGoalsTable{
  goalname: string;
  activities: [];
  date: Date;
  id: '';
  constructor(goalname, activities, date){
    this.goalname = goalname;
    this.activities = activities;
    this.date = date;
  }
}

export class DataForLinesTable{
  shortname: string;
  activities: [];
  id: '';
  constructor(shortname, activities){
    this.shortname = shortname;
    this.activities = activities;
  };
  schedule: ManufacturingScheduleComponent;
}

@Component({
  selector: 'app-manufacturing-schedule',
  templateUrl: './manufacturing-schedule.component.html',
  styleUrls: ['./manufacturing-schedule.component.css']
})
export class ManufacturingScheduleComponent implements OnInit {


  @ViewChild("timeline") timelineContainer: ElementRef;
  tlContainer: any;
  timeline: any;
  data: any;
  groups: any;
  options: {};
  unscheduledData: any;
  enableGoalsDialogRef: MatDialogRef<EnableGoalsDialogComponent>;
  goalsData: DataForGoalsTable[] = [];
  goalsDataSource = new MatTableDataSource<DataForGoalsTable>(this.goalsData);
  linesData: DataForLinesTable[] =[];
  linesDataSource = new MatTableDataSource<DataForLinesTable>(this.linesData);

  constructor(public rest:RestService, private restv2: RestServiceV2, private dialog: MatDialog, myElement: ElementRef) { 
      this.getTimelineData();
      this.getTimelineGroups();
      this.getOptions();
  }

  ngOnInit() {
    this.refreshData(); 
  }

  ngAfterViewInit() {     
    this.tlContainer = this.timelineContainer.nativeElement;       
    this.timeline = new vis.Timeline(this.tlContainer, null, this.options);      
    this.timeline.setGroups(this.groups);
    this.timeline.setItems(this.data); 
  }

  refreshData() {
    var thisobject = this;
    console.log("Refresh data");
    this.goalsData = [];
    this.rest.getUserName().then(result => {
        this.rest.getGoals(result.toString(), "", "", true, 5).subscribe(goals => {
          goals.forEach(goal => {
            var activityList = [];
            if(goal['enabled']){
            goal['activities'].forEach(activity => {
              console.log('activity', activity)
              this.rest.getActivities( null, 100).subscribe(sameActivity => {
                console.log('sameActivity', sameActivity)
              });
              if(activity['activity']['line'] == null || activity['activity']['line'] == undefined){
                activityList.push(activity['activity'])
              }
            });
            let goalTable = new DataForGoalsTable(goal['goalname'], activityList, goal['date'])
            this.goalsData.push(goalTable)
            }
        });
        this.goalsDataSource = new MatTableDataSource<DataForGoalsTable>(this.goalsData);
        console.log(this.goalsDataSource)
      });
    })
  }

  handleDragStart(event, activity) {
    console.log('start drag', event)
    console.log(activity)
    var dragSrcEl = event.target;
    
    
    event.dataTransfer.effectAllowed = 'move';
    var itemType = 'range';
    var item = {
        // id: activity['_id'],
        type: itemType,
        id: new Date(),
        // content: event.target.innerHTML.trim()
        content: event.target.innerHTML.trim() + "::" + activity['_id']
    };
    // set event.target ID with item ID
    event.target.id = new Date(item.id).toISOString();
    event.dataTransfer.setData("text", JSON.stringify(item));

    // Trigger on from the new item dragged when this item drag is finish
    event.target.addEventListener('dragend', this.handleDragEnd.bind(this), false);
  }

  async handleDragEnd(event): Promise<void> {
    // Last item that just been dragged, its ID is the same of event.target
    console.log('end', event.target.id)
    console.log(this.timeline.itemsData)
    var newItem_dropped = this.timeline.itemsData.get(event.target.id);
    console.log(newItem_dropped)
    var newGroup = this.groups.get(newItem_dropped.group)
    this.checkLine(newItem_dropped, newGroup).then(isValid => {
      console.log('isValid', isValid)
      if (!isValid) {
        this.timeline.itemsData.remove(newItem_dropped);
      }
      else {
        var item = this.data.get(newItem_dropped);
        
      }
    })
    
    
  }

  async checkLine(item, group): Promise<Boolean> {
    var name = item.content.split("::")[0];
    var response = await this.restv2.getSkus(AndVsOr.OR, name, null, null, null, null, null, 1);
    console.log(response[0])
    var line = await this.restv2.getLine(AndVsOr.OR, "","", group.content, "", 1)
    console.log(line)
    if (line[0]['skus']) {
      console.log(line[0]['skus'])
      var count = 0;
      var skuObject;
      line[0]['skus'].forEach(sku => {
        if (sku['sku']['skuname'] == response[0]['skuname']) {
          count ++;
          skuObject = sku['sku']
        }
      });
      if (count == 1) {
        var activities = await this.restv2.getActivities(AndVsOr.OR, null, null, skuObject['_id'], 100)
        console.log(activity)
        var newActivity;
        var activityid = item.content.split("::")[1];
        activities.forEach(activity => {
          if (activity['_id'] == activityid) {
            newActivity = activity;
          }
        })
        
        console.log('activityid', activityid)
        console.log(newActivity['_id'])
        var modify = await this.restv2.modifyActivity(AndVsOr.AND, activityid, newActivity['sku']['_id'], 
        newActivity['numcases'], newActivity['calculatedhours'], newActivity['sethours'], 
        item['start'], line[0]['_id']);
        console.log(modify)
        var activity = await this.restv2.getActivities(AndVsOr.OR, null, null, skuObject['_id'], 1)
        console.log(activity);
        this.refreshData();
        this.getTimelineData();
        this.timeline.redraw();  
        return true; 
      }
      else {
        console.log('wrong')
        return false;
        // this.timeline.itemsData.remove(item);
      }
    }
    
  }

  getTimelineGroups() {
    // create groups
    this.groups = new vis.DataSet();
    this.rest.getLine('','.*','','.*',100).subscribe(lines => {
      lines.forEach(line => {
        var currentLineName = line['shortname'];
        var currentActivities = [];
        var currentId = line['_id'];
        this.groups.add({
          id: currentId, 
          content: currentLineName})
        })
      })
    }

  async getTimelineData(): Promise<void> {
      // Create a DataSet (allows two way data-binding)
    // create items
    this.data = new vis.DataSet();
    this.data.clear();

    var lines = await this.restv2.getLine(AndVsOr.OR, "", ".*", "", ".*", 100);
    console.log('lines', lines)
    lines.forEach(line => {
      this.rest.getActivities(null, 100, line['_id']).subscribe(activities => {
        console.log('activites', activities)
        if (activities.length > 0) {
          activities.forEach(activity => {
            var duration = activity['calculatedhours'];
            if (activity['sethours']) {
              duration = activity['sethours'];
            }
            console.log('startDate', activity['startdate'], 'duration', duration)
            var endDate = this.calculateEndDate(new Date(activity['startdate']), Math.round(duration));
            console.log('endDate', endDate)
            // console.log('startDate', activity['startdate'])
            // var endDate = new Date(1000 * 60 * 60 * (Math.round(duration) + (Math.floor(duration / 14)*14)) + (new Date(activity['startdate'])).valueOf()); 
            // console.log('original end date', endDate)
            // var startTime = parseInt((activity['startdate'].split('T')[1]).split(':')[0], 10);
            // console.log('startTime', startTime, 'duration', duration)
            // if (startTime + (duration) > 18 || startTime + duration < 8) {
            //   var end = startTime + (duration%14);
            //   endDate = new Date(1000 * 60 * 60 * 14 + (new Date(endDate)).valueOf());
            // }
            // if (startTime < 8) {
            //   endDate = new Date(1000 * 60 * 60 * (8-startTime) + (new Date(endDate)).valueOf());
            // }
            // if (startTime > 18) {
            //   endDate = new Date(1000 * 60 * 60 * (startTime-18+8) + (new Date(endDate)).valueOf());
            // }
            // console.log('final end date', endDate)
            // var endDate = new Date(1000 * 60 * 60 * duration + (new Date(activity['startdate'])).valueOf());
            this.data.add({
              id: activity['_id'],
              group: line['_id'],
              start: activity['startdate'],
              end: endDate,
              content: activity['sku']['skuname']
            })
          })
        }
        console.log(this.data)
      })
    })
  }

  async getOptions(): Promise<void> {
     // specify options
    var thisObject = this;
    this.options = {
      stack: false,
      start: new Date(),
      end: new Date(1000*60*60*24 + (new Date()).valueOf()),
      editable: {
        add: true,         // add new items by double tapping
        // updateTime: true,  // drag items horizontally
        updateGroup: true, // drag items from one group to another
        remove: true       // delete an item by tapping the delete button top right
      },
      margin: {
        item: 10, // minimal margin between items
        axis: 5   // minimal margin between items and the axis
      },
      orientation: 'top',
      hiddenDates: [
        {start: '2013-03-29 18:00:00', end: '2013-03-30 08:00:00', repeat: 'daily'},
        {start: '2013-10-26 00:00:00', end: '2013-10-28 00:00:00', repeat: 'weekly'}
    ],
      
      onRemove: async function(item, callback): Promise<void> {
        console.log(item, callback);
        var getSku = await thisObject.restv2.getSkus(AndVsOr.OR, item['content'], null, null, null, null, null, 1);
        var activity = await thisObject.restv2.getActivities(AndVsOr.AND, item['start'], null, getSku[0]['_id'], 1);
        console.log('activity to delete', activity, activity[0]['startdate'])
        console.log(item['id'], activity[0]['_id'])
        
        thisObject.rest.modifyActivity(activity[0]['_id'], activity[0]['sku']['_id'], 
        activity[0]['numcases'], activity[0]['calculatedhours'], activity[0]['sethours'], 
        activity[0]['startdate'], null).subscribe(response => {
          console.log(response) 
          thisObject.refreshData();
          thisObject.data.remove(item['id']);
          thisObject.getTimelineData();
          callback(item)
        });  
      },
      
      onMove: async function(item, callback): Promise<void> {
        console.log(item, callback);
        var newGroup = thisObject.groups.get(item['group']);
        console.log(newGroup)
        thisObject.checkLine(item, newGroup).then(isValid => {
          console.log('isValid', isValid)
          if (!isValid) {
            callback(null)
          }
          else {
            callback(item)
          }
        })
      },

      onUpdate: async function (item, callback): Promise<void> {
        var getSku = await thisObject.restv2.getSkus(AndVsOr.OR, item['content'], null, null, null, null, null, 1);
        var activity = await thisObject.restv2.getActivities(AndVsOr.AND, item['start'], null, getSku[0]['_id'], 1);
        var newDuration = prompt('Choose new activity duration (in hours):', activity[0]['calculatedhours']);
        console.log(newDuration)
        
        if (item.content != null) {
          thisObject.rest.modifyActivity(activity[0]['_id'], activity[0]['sku']['_id'], 
          activity[0]['numcases'], activity[0]['calculatedhours'], parseInt(newDuration, 10), 
          activity[0]['startdate'], activity[0]['line']).subscribe(response => {
            console.log(response) 
            thisObject.refreshData();
            thisObject.getTimelineData();
            callback(item)
        }); 
        }
        else {
          callback(null); // cancel updating the item
        }
      }
    };
  }

  openEnableGoalsDialog() {
    const dialogConfig = new MatDialogConfig();
    this.enableGoalsDialogRef = this.dialog.open(EnableGoalsDialogComponent, dialogConfig);
    this.enableGoalsDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  calculateEndDate(startDate: Date, hours: number): Date {
    var endDate = new Date(startDate);
    const NUM_HOURS_PER_DAY = 10;
    const remainder = hours % NUM_HOURS_PER_DAY;
    console.log('startDate', startDate)
    while (moment().isoWeekdayCalc([startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDay()], [endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDay()], [2, 3, 4, 5, 6]) * NUM_HOURS_PER_DAY < hours) {
      endDate.setDate(endDate.getDate() + 1);
    }
    endDate = new Date(1000 * 60 * 60 * remainder + (new Date(endDate)).valueOf());
    return endDate;
  }
}

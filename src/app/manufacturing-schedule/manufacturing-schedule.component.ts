import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as vis from 'vis';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource,MatPaginator, MatSnackBar } from "@angular/material";
import { EnableGoalsDialogComponent } from '../enable-goals-dialog/enable-goals-dialog.component'
import { RestService } from '../rest.service';
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { LegendDetailsComponent } from './legend-details.component';
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
  legendDialogRef: MatDialogRef<LegendDetailsComponent>;

  constructor(public rest:RestService, private restv2: RestServiceV2, private dialog: MatDialog, myElement: ElementRef) { 
      this.getTimelineData();
      this.getTimelineGroups();
      this.getOptions();
  }

  ngOnInit() {
    this.refreshData(); 
    this.tlContainer = document.getElementById('timeline');      
    this.timeline = new vis.Timeline(this.tlContainer, null, this.options);      
    this.timeline.setGroups(this.groups);
    this.timeline.setItems(this.data); 
  }

  ngAfterViewInit() {     
    
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
                // console.log('sameActivity', sameActivity)
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
    // console.log('start drag', event)
    // console.log(activity)
    var dragSrcEl = event.target;
    
    
    event.dataTransfer.effectAllowed = 'move';
    var itemType = 'range';
    var item = {
        type: itemType,
        id: new Date(),
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
    var newItem_dropped = this.timeline.itemsData.get(event.target.id);
    console.log('drag item', newItem_dropped)

    var newGroup = this.groups.get(newItem_dropped.group)
    this.checkLine(newItem_dropped, newGroup).then(async isValid => {
      console.log('isValid', isValid)
      if (!isValid) {
        this.timeline.itemsData.remove(newItem_dropped);
      }
      else {
        var activities = await this.restv2.getActivities(AndVsOr.OR, null, null, null, 500);
        var activityid = newItem_dropped.content.split("::")[1];
        activities.forEach(activity => {
          if (activity['_id'] == activityid) {
            var className = 'normal';
            var duration = activity['calculatedhours'];
            if (activity['sethours']) {
              duration = activity['sethours'];
              className = "updated"
            }
            var startTime = parseInt((activity['startdate'].split('T')[1]).split(':')[0], 10) - 7;
            var endDate = this.calculateEndDate(new Date(activity['startdate']), Math.round(duration), startTime);
            this.checkOverdue(activity['_id'], endDate).then(isOverdue => {
              if (isOverdue) {
                className = 'overdue';
              }
              this.timeline.itemsData.update({
                id: newItem_dropped['id'],
                group: newGroup,
                start: activity['startdate'],
                end: endDate,
                content: activity['sku']['skuname'],
                className: className
              })
              console.log('timeline data',this.timeline.itemsData)
            })
          }
        }) 
      }
    }) 
  }


  async checkLine(item, group): Promise<Boolean> {
    var name = item.content.split("::")[0];
    var response = await this.restv2.getSkus(AndVsOr.OR, name, null, null, null, null, null, 1);
    var line = await this.restv2.getLine(AndVsOr.OR, "","", group.content, "", 1)
    if (line[0]['skus']) {
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
        var newActivity;
        var activityid;
        console.log(item.content)
        if (item.content.split("::")[1]) {
          var activityid = item.content.split("::")[1];
        }
        else {
          activityid = item.id;
        }
        activities.forEach(activity => {
          if (activity['_id'] == activityid) {
            newActivity = activity;
            console.log('newActivity', newActivity)
          }
        })
        var modify = await this.restv2.modifyActivity(AndVsOr.AND, activityid, newActivity['sku']['_id'], 
        newActivity['numcases'], newActivity['calculatedhours'], newActivity['sethours'], 
        item['start'], line[0]['_id']);
        // var activity = await this.restv2.getActivities(AndVsOr.OR, null, null, skuObject['_id'], 1)
        this.refreshData();
        return true; 
      }
      else {
        return false;
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
    this.data.on('*', function (event, properties, senderId) {
      console.log('event', event, properties);
    });

    var lines = await this.restv2.getLine(AndVsOr.OR, "", ".*", "", ".*", 100);
    lines.forEach(line => {
      this.rest.getActivities(null, 100, line['_id']).subscribe(activities => {
        console.log('activites', activities)
        if (activities.length > 0) {
          activities.forEach(activity => {
            this.addItem(activity, line['_id']);
          })
        }
        console.log(this.data)
      })
    })
  }

  async addItem(activity, group): Promise<void> {
    var className = 'normal';
    var duration = activity['calculatedhours'];
    if (activity['sethours']) {
      duration = activity['sethours'];
      className = 'updated'
    }
    var startTime = parseInt((activity['startdate'].split('T')[1]).split(':')[0], 10) - 7;
    var endDate = this.calculateEndDate(new Date(activity['startdate']), Math.round(duration), startTime);
    this.checkOverdue(activity['_id'], endDate).then(isOverdue => {
      if (isOverdue) {
        className = 'overdue';
      }
      this.checkOrphaned(activity['_id']).then(isOrphaned => {
        if(isOrphaned) {
          className = 'orphan'
        }
        this.data.add({
          id: activity['_id'],
          group: group,
          start: activity['startdate'],
          end: endDate,
          content: activity['sku']['skuname'],
          className: className
        })
      })
    })
  }

  async checkOverdue(activityId, endDate): Promise<Boolean> {
    var goals = await this.restv2.getGoals(AndVsOr.AND, null, null, ".*", true, 500);
    var isOverdue = false;
    goals.forEach(goal => {
      goal['activities'].forEach(activity => {
        if (activity['activity']['_id'] == activityId) {
          var deadline = new Date(goal['date'])
          // console.log(endDate.getTime(), deadline, endDate.getTime() > deadline.getTime())
          if (endDate.getTime() > deadline.getTime()) {
            isOverdue = true;
          }
        }
      })
    })
    return isOverdue;
  }

  async checkOrphaned(activityId): Promise<Boolean> {
    var goals = await this.restv2.getGoals(AndVsOr.AND, null, null, ".*", false, 500);
    var isOrphaned = false;
    goals.forEach(goal => {
      goal['activities'].forEach(activity => {
        if (activity['activity']['_id'] == activityId) {
          // console.log('goal', goal)
          if (!goal['enabled']) {
            // console.log('is orphaned')
            isOrphaned = true;
          }
        }
      })
    })
    return isOrphaned;
  }

  async getOptions(): Promise<void> {
     // specify options
    var thisObject = this;
    this.options = {
      stack: false,
      start: new Date(),
      autoResize: true,
      end: new Date(1000*60*60*168 + (new Date()).valueOf()),
      editable: {
        add: true,         // add new items by double tapping
        updateTime: true,  // drag items horizontally
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
        // console.log(item, callback);
        var getSku = await thisObject.restv2.getSkus(AndVsOr.OR, item['content'], null, null, null, null, null, 1);
        var activity = await thisObject.restv2.getActivities(AndVsOr.AND, item['start'], null, getSku[0]['_id'], 1);
        console.log('activity to delete', activity, activity[0]['startdate'])

        thisObject.rest.modifyActivity(activity[0]['_id'], activity[0]['sku']['_id'], 
        activity[0]['numcases'], activity[0]['calculatedhours'], activity[0]['sethours'], 
        activity[0]['startdate'], null).subscribe(response => {
          console.log(response) 
          thisObject.refreshData();
          thisObject.data.remove(item['id']);
          thisObject.getTimelineData();
          callback(item)
        }) 
      },
      
      onMove: async function(item, callback): Promise<void> {
        // console.log(item, callback);
        var newGroup = thisObject.groups.get(item['group']);
        console.log(newGroup)
        thisObject.checkLine(item, newGroup).then(isValid => {
          console.log('isValid', isValid)
          if (!isValid) {
            callback(null)
          }
          else {
            thisObject.checkOverdue(item['id'], item['end']).then( isOverdue => {
              if (isOverdue && item['className'] != 'orphan') {
                item['className'] = 'overdue';
              }
              else if (!isOverdue && item['className'] == 'overdue') {
                item['className'] = 'normal';
              }
              callback(item);
            })
            
          }
        })
      },

      onUpdate: async function (item, callback): Promise<void> {
        // console.log('update')
        var getSku = await thisObject.restv2.getSkus(AndVsOr.OR, item['content'], null, null, null, null, null, 1);
        var activity = await thisObject.restv2.getActivities(AndVsOr.AND, item['start'], null, getSku[0]['_id'], 1);
        var displayDuration = activity[0]['calculatedhours'];
        if (activity[0]['sethours']) {
          displayDuration = activity[0]['sethours']
        }
        var newDuration = prompt('Choose a new duration for this activity. The calculated duration is ' 
        + activity[0]['calculatedhours'] + ' hours.', displayDuration);
        
        if (item.content != null) {
          /* Changed from rest to restv2, recheck this */
          var response = await thisObject.restv2.modifyActivity(AndVsOr.AND, activity[0]['_id'], activity[0]['sku']['_id'], 
          activity[0]['numcases'], activity[0]['calculatedhours'], parseInt(newDuration, 10), 
          activity[0]['startdate'], activity[0]['line']);
          console.log(response) 
          var className = item.className;
          if (className == 'normal') {
            className = 'updated'
          }
          if ((activity[0]['calculatedhours'] == parseInt(newDuration, 10)) && className == 'updated') {
            className = 'normal';
          }
          var startTime = parseInt((activity[0]['startdate'].split('T')[1]).split(':')[0], 10) - 7;
          var endDate = thisObject.calculateEndDate(new Date(item['start']), Math.round(parseInt(newDuration, 10)), startTime);
          
          item.className = className;
          item.end = endDate
          callback(item);
        }
        else {
          callback(null); // cancel updating the item
        }
      },

      onAdd: async function (item, callback): Promise<void> {
        console.log('on add item', item)
        if (item.content == 'new item') {
          callback(null);
        }
        // else {
          // thisObject.checkLine(item, item.group).then(async isValid => {
          //   if (!isValid) {
          //     console.log('not valid')
          //     callback(null);
          //   }
            else {
              callback(item);
            }
        //   })
        // }
      }
    };
  }

  async openEnableGoalsDialog(): Promise<void> {
    const dialogConfig = new MatDialogConfig();
    this.enableGoalsDialogRef = this.dialog.open(EnableGoalsDialogComponent, dialogConfig);
    this.enableGoalsDialogRef.afterClosed().subscribe(async event => {
      this.refreshData();
      var activities = await this.restv2.getActivities(AndVsOr.OR, null, null, null, 500);
      console.log(activities)
      activities.forEach(activity => {
        this.checkOrphaned(activity['_id']).then(isOrphaned => {
          var className;
          var orphanItem = this.data.get(activity['_id']);
          var update = false;
          if ((orphanItem['className'] == 'orphan') && !isOrphaned) {
            className = 'normal';
            update = true
            this.checkOverdue(orphanItem['id'], orphanItem['end']).then(isOverdue => {
              if (isOverdue) {
                className = 'overdue';
              }
            })
          }
          if (isOrphaned) {
            className = 'orphan';
            update = true;
          }
          if (update) {
            this.data.update({
              id: orphanItem['id'],
              group: orphanItem['group'],
              start: orphanItem['start'],
              end: orphanItem['end'],
              content: orphanItem['content'],
              className: className
            })
          }
        })
      })
    });
  }

  calculateEndDate(startDate: Date, hours: number, startTime: number): Date {
    var endDate = new Date((new Date(startDate)).valueOf());
    // var endDate = new Date(startDate);
    const NUM_HOURS_PER_DAY = 10;
    const remainder = hours % NUM_HOURS_PER_DAY;
    // console.log('startDate', endDate)
    while (moment().isoWeekdayCalc([startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDay()], [endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDay()+1], [1, 2, 3, 4, 5]) < Math.floor(hours / NUM_HOURS_PER_DAY)) {
      // console.log('plus one day', moment().isoWeekdayCalc([startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDay()], [endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDay()+1], [1, 2, 3, 4, 5]) * NUM_HOURS_PER_DAY)
      // console.log(startDate.getUTCDay(), endDate.getUTCDay())
      endDate.setDate(endDate.getDate() + 1);
    }
    // console.log('endDate', endDate)
    endDate = new Date(1000 * 60 * 60 * remainder + (new Date(endDate)).valueOf());
    if (startTime < 0) {
      startTime = 24 + startTime
    }
    if (hours + startTime > 18 || hours + startTime < 8) {
      endDate = new Date(1000 * 60 * 60 * 14 + (new Date(endDate)).valueOf());
    }
    return endDate;
  }

  showLegend(){
    const dialogConfig = new MatDialogConfig()
    this.legendDialogRef = this.dialog.open(LegendDetailsComponent, dialogConfig);
    this.legendDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }
}


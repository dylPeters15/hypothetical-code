import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as vis from 'vis';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource,MatPaginator, MatSnackBar } from "@angular/material";
import { EnableGoalsDialogComponent } from '../enable-goals-dialog/enable-goals-dialog.component'
import { RestService } from '../rest.service';
import { RestServiceV2, AndVsOr } from '../restv2.service';

// declare var vis = require('vis');

export class DataForGoalsTable{
  goalname: string;
  activities: [];
  id: '';
  constructor(goalname, activities){
    this.goalname = goalname;
    this.activities = activities;
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
    // this.refreshData();    
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
              })
              
              if(activity['activity']['line'] == null || activity['activity']['line'] == undefined){
                activityList.push(activity['activity'])
              }
            })
            let goalTable = new DataForGoalsTable(goal['goalname'], activityList)
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
        id: new Date(),
        type: itemType,
        content: event.target.innerHTML.trim()
    };
    // set event.target ID with item ID
    event.target.id = new Date(item.id).toISOString();

    // var isFixedTimes = (event.target.innerHTML.split('-')[2] && event.target.innerHTML.split('-')[2].trim() == 'fixed times')
    // if (isFixedTimes) {
    //     this.data.start = new Date();
    //     this.data.end = new Date(1000 * 60 * 10 + (new Date()).valueOf());
    // }
    event.dataTransfer.setData("text", JSON.stringify(item));

    // Trigger on from the new item dragged when this item drag is finish
    event.target.addEventListener('dragend', this.handleDragEnd.bind(this), false);
  }

  async handleDragEnd(event): Promise<void> {
    // Last item that just been dragged, its ID is the same of event.target
    console.log('end', event)
    var newItem_dropped = this.timeline.itemsData.get(event.target.id);
    console.log(newItem_dropped)
    var newGroup = this.groups.get(newItem_dropped.group)
    var response = await this.restv2.getSkus(AndVsOr.OR, newItem_dropped.content, null, null, null, null, null, 1);
    console.log(response[0])
    var line = await this.restv2.getLine(AndVsOr.OR, "","", newGroup.content, "", 1)
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
        var activity = await this.restv2.getActivities(AndVsOr.OR, null, null, skuObject['_id'], 1)
        console.log(activity)
        var modify = await this.restv2.modifyActivity(AndVsOr.AND, activity[0]['_id'], activity[0]['sku']['_id'], 
        activity[0]['numcases'], activity[0]['calculatedhours'], activity[0]['sethours'], 
        newItem_dropped['start'], line[0]['_id']);
        console.log(modify)
        var activity = await this.restv2.getActivities(AndVsOr.OR, null, null, skuObject['_id'], 1)
        console.log(activity)
          
      }
      else {
        console.log('wrong')
        this.timeline.itemsData.remove(event.target.id);
      }
      
    }
    this.refreshData();
    this.getTimelineData();
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
    // this.linesDataSource = new MatTableDataSource<DataForLinesTable>(this.linesData);
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
            this.data.add({
              id: activity['_id'],
              group: line['_id'],
              start: activity['startdate'],
              end: new Date(1000 * 60 * 60 * duration + (new Date(activity['startdate'])).valueOf()),
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
        updateTime: true,  // drag items horizontally
        updateGroup: true, // drag items from one group to another
        remove: true       // delete an item by tapping the delete button top right
      },
      margin: {
        item: 10, // minimal margin between items
        axis: 5   // minimal margin between items and the axis
      },
      orientation: 'top',
      onRemove: async function(item, callback): Promise<void> {
        console.log(item);
        var getSku = await thisObject.restv2.getSkus(AndVsOr.OR, item['content'], null, null, null, null, null, 1);
        var activity = await thisObject.restv2.getActivities(AndVsOr.AND, item['start'], null, getSku[0]['_id'], 1);
        console.log('activity to delete', activity, activity[0]['startdate'])
        console.log(item['id'], activity[0]['_id'])
        
        var response = await thisObject.restv2.modifyActivity(AndVsOr.AND, activity[0]['_id'], activity[0]['sku']['_id'], 
        activity[0]['numcases'], activity[0]['calculatedhours'], activity[0]['sethours'], 
        activity[0]['startdate'], null);
          console.log(response) 
          thisObject.refreshData();
          thisObject.data.remove(item['id']);
          thisObject.getTimelineData();
        
        
        
        
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

}

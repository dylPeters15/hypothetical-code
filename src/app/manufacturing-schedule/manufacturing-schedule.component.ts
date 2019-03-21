import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as vis from 'vis';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource,MatPaginator, MatSnackBar } from "@angular/material";
import { EnableGoalsDialogComponent } from '../enable-goals-dialog/enable-goals-dialog.component'
import { RestService } from '../rest.service';

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

  constructor(public rest:RestService, private dialog: MatDialog, myElement: ElementRef) { 
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

  handleDragStart(event) {
    console.log('start drag', event)
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

    var isFixedTimes = (event.target.innerHTML.split('-')[2] && event.target.innerHTML.split('-')[2].trim() == 'fixed times')
    if (isFixedTimes) {
        this.data.start = new Date();
        this.data.end = new Date(1000 * 60 * 10 + (new Date()).valueOf());
    }
    event.dataTransfer.setData("text", JSON.stringify(item));

    // Trigger on from the new item dragged when this item drag is finish
    event.target.addEventListener('dragend', this.handleDragEnd.bind(this), false);
  }

  handleDragEnd(event) {
    // Last item that just been dragged, its ID is the same of event.target
    var newItem_dropped = this.timeline.itemsData.get(event.target.id);

    var html = "<b>id: </b>" + newItem_dropped.id + "<br>";
    html += "<b>content: </b>" + newItem_dropped.content + "<br>";
    html += "<b>start: </b>" + newItem_dropped.start + "<br>";
    html += "<b>end: </b>" + newItem_dropped.end + "<br>";
    // document.getElementById('output').innerHTML = html;
  }

  getTimelineGroups() {
     // create groups
    this.groups = new vis.DataSet([
      {id: 1, content: 'Truck&nbsp;1'},
      {id: 2, content: 'Truck&nbsp;2'},
      {id: 3, content: 'Truck&nbsp;3'},
      {id: 4, content: 'Truck&nbsp;4'}
    ]);
    }

  getTimelineData() {
      // Create a DataSet (allows two way data-binding)
    // create items
    this.data = new vis.DataSet();
    var count = 100;
    var order = 1;
    var truck = 1;
    var max : any = 0.02;

    // create 4 truck groups, then order inside each group
    for (var j = 0; j < 4; j++) {
      var date = new Date();
      for (var i = 0; i < count/4; i++) {
        
        date.setHours(date.getHours() +  4 * Math.random());
        var start = new Date(date);

        date.setHours(date.getHours() + 2 + Math.floor(Math.random()*4));
        var end = new Date(date);

        this.data.add({
          id: order,
          group: truck,
          start: start,
          end: end,
          content: 'Order ' + order
        });

        order++;
      }
      truck++;
    }
   
    var thisObject = this;
  //   window.addEventListener("load", function(event) {
  //     // console.log(document.getElementsByClassName('gtableheader').length);
  //     var items = document.getElementsByClassName('item');
  //   console.log(items)
  //   // this.unscheduledData.addEventListener('dragstart', this.handleDragStart.bind(this), false);
  //   console.log(items.length)

  //   for (var i = items.length - 1; i >= 0; i--) {
  //     var item = items[i];
  //     console.log('test')
  //     item.addEventListener('dragstart', thisObject.handleDragStart.bind(thisObject), false);
  //     console.log('item')
  //   }  
  // });
  }

  getOptions() {
     // specify options
    this.options = {
      stack: false,
      start: new Date(),
      end: new Date(1000*60*60*24 + (new Date()).valueOf()),
      editable: true,
      margin: {
        item: 10, // minimal margin between items
        axis: 5   // minimal margin between items and the axis
      },
      orientation: 'top',
      onDropObjectOnItem: function(objectData, item, callback) {
        if (!item) { return; }
        alert('dropped object with content: "' + objectData.content + '" to item: "' + item.content + '"');
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

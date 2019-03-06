import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as vis from 'vis';
// declare var vis = require('vis');

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

  constructor() { 
      this.getTimelineData();
      this.getTimelineGroups();
      this.getOptions();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {     
    this.tlContainer = this.timelineContainer.nativeElement;       
    this.timeline = new vis.Timeline(this.tlContainer, null, this.options);      
    this.timeline.setGroups(this.groups);
    this.timeline.setItems(this.data);

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
      orientation: 'top'
    };
  }

}



// var moment = require('moment');
// require('moment-weekday-calc');

// export class DataForGoalsTable{
//   goalname: string;
//   activities: [];
//   id: '';
//   constructor(goalname, activities){
//     this.goalname = goalname;
//     this.activities = activities;
//   }
// }

// export class DataForLinesTable{
//   shortname: string;
//   activities: [];
//   id: '';
//   constructor(shortname, activities){
//     this.shortname = shortname;
//     this.activities = activities;
//   };
//   schedule: ManufacturingScheduleComponent;
// }




// @Component({
//   selector: 'app-manufacturing-schedule',
//   templateUrl: './manufacturing-schedule.component.html',
//   styleUrls: ['./manufacturing-schedule.component.css']
// })
// export class ManufacturingScheduleComponent implements OnInit {
//   enableGoalsDialogRef: MatDialogRef<EnableGoalsDialogComponent>;
//   goalsData: DataForGoalsTable[] = [];
//   goalsDataSource = new MatTableDataSource<DataForGoalsTable>(this.goalsData);
//   startDate: Date = new Date();
//   endDate: Date = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear()+1));
//   linesData: DataForLinesTable[] =[];
//   linesDataSource = new MatTableDataSource<DataForLinesTable>(this.linesData);
//   HOURS_PER_DAY = 10;
//   numberOfDays: number;
//   constructor(public rest:RestService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) { }
//   totalHours: number;

//   ngOnInit() {
//     // this.refreshData();
//     this.selectionChange();
//   }


//   refreshData() {
//     var thisobject = this;
//     console.log("Refresh data");
//     this.goalsData = [];
//     this.rest.getUserName().then(result => {
//         this.rest.getGoals(result.toString(), "", "", true, 5).subscribe(goals => {
//           goals.forEach(goal => {
//             var activityList = [];
//             if(goal['enabled']){
//             goal['activities'].forEach(activity => {
//               if(activity['activity']['line'] == null || activity['activity']['line'] == undefined){
//                 activityList.push(activity['activity'])
//               }
//             })
//             let goalTable = new DataForGoalsTable(goal['goalname'], activityList)
//             this.goalsData.push(goalTable)
//             }
//         });
//         this.goalsDataSource = new MatTableDataSource<DataForGoalsTable>(this.goalsData);
//         console.log(this.goalsDataSource)
//       });
//   })
//   this.linesData = [];
//   this.rest.getLine('','.*','','.*',100).subscribe(response => {
//     response.forEach(line => {
//       var currentLineName = line['shortname'];
//       var currentActivities = [];
//       this.rest.getActivities(null,100,line['_id']).subscribe(activities => {
//         if(activities.length > 0){
//           activities.forEach(activity => {
//             var activityStart = new Date(activity['startdate'])
//             var activityEnd = new Date(activityStart);
//             let hours = activity['sethours'] || activity['calculatedhours'];
//             const NUM_HOURS_PER_DAY = 10;
      
//             while (moment().isoWeekdayCalc([activityStart.getUTCFullYear(), activityStart.getUTCMonth(), activityStart.getUTCDay()], [activityStart.getUTCFullYear(), activityEnd.getUTCMonth(), activityEnd.getUTCDay()], [2, 3, 4, 5, 6]) * NUM_HOURS_PER_DAY < hours) {
//               activityEnd.setDate(activityEnd.getDate() + 1);
//             }
//             activity['startdatestring'] = activityStart.getMonth()+1 + "/" + activityStart.getDate() + "/" + activityStart.getFullYear();
//             activity['enddatestring'] = activityEnd.getMonth()+1 + "/" + activityEnd.getDate() + "/" + activityEnd.getFullYear();

//             if(currentActivities.indexOf(activity) == -1){
//               currentActivities.push(activity);
//             }
//           })
//         }
//         let newLine = new DataForLinesTable(currentLineName, currentActivities);
//         this.linesData.push(newLine);
//       });

//     })

//   })
//   this.linesDataSource = new MatTableDataSource<DataForLinesTable>(this.linesData);

//   this.totalHours = (this.HOURS_PER_DAY * this.numberOfDays);

// }


  
//   openEnableGoalsDialog() {
//     const dialogConfig = new MatDialogConfig();
//     this.enableGoalsDialogRef = this.dialog.open(EnableGoalsDialogComponent, dialogConfig);
//     this.enableGoalsDialogRef.afterClosed().subscribe(event => {
//       this.refreshData();
//     });
//   }

//   selectionChange(event?: Event) {
//     var duration = moment().isoWeekdayCalc(this.startDate,this.endDate,[1,2,3,4,5]);
//     console.log(duration)
//     this.refreshData();
//   }

//   // drop(event: CdkDragDrop<string[]>) {
//   //   if (event.previousContainer === event.container) {
//   //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//   //   } else {
//   //     transferArrayItem(event.previousContainer.data,
//   //                       event.container.data,
//   //                       event.previousIndex,
//   //                       event.currentIndex);
//   //   }
//   // }
// }
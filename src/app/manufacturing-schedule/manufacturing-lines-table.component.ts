import { Component, Input, forwardRef, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { RestService } from '../rest.service';
import { MatDialog, MatDialogRef, MatTableDataSource, MatPaginator } from "@angular/material";
import {NewProductLineDialogComponent } from '../new-product-line-dialog/new-product-line-dialog.component';
import {MatIconModule} from '@angular/material/icon'
import { __values } from 'tslib';
import { forEach } from '@angular/router/src/utils/collection';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ManufacturingLinesTableComponent),
  multi: true
};


var moment = require('moment');
require('moment-weekday-calc');

@Component({
  selector: 'app-manufacturing-lines-table',
  templateUrl: './manufacturing-lines-table.component.html',
  styleUrls: ['./manufacturing-lines-table.component.css'],
  providers: [customValueProvider]
})
export class ManufacturingLinesTableComponent implements ControlValueAccessor {
  _value = '';
  stringified = '';
  activitiesExist: boolean = false;
  startDate = new Date();
  endDate = new Date();
  startDateString = '';
  endDateString = '';
  constructor(public rest: RestService, public dialog: MatDialog) { }


  propagateChange: any = () => { };

  @Input() label: string;

  writeValue(value: any) {
    if (value) {
      this._value = value;
      this.stringified = JSON.stringify(value);
      if(this._value['activities'].length > 1){
        this.activitiesExist = true;
      }
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void { }

  onChange(event) {
    this.stringified = JSON.stringify(event.target.value);
    this.propagateChange(event.target.value);
  }
  
  drop(event: CdkDragDrop<string[]>) {
    console.log('previous container id',event.previousContainer)
    console.log('container id',event.container)
    console.log('container data',event.container.data)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      var isValid = false;
      // let promise1 = new Promise((resolve,reject) => {
      //   this.rest.getLine("", null, event.container.id, "", 1).subscribe((line) => {
      //     line['skus']['_id'].forEach((sku) => {
      //       if (sku == event.previousContainer.id) {
      //       }
      //     });
      //   })
      // })
      console.log(event)
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
        console.log('previous container id',event.previousContainer.id)
        console.log('container id',event.container.id)
        console.log('container skus',event.container.data)
        let activitiesOnLine = event.container.data;
        this.rest.getLine('','',event.container.id, event.container.id, 1).subscribe(response => {
          let currentLine = response[0];
          console.log("LINE: " + JSON.stringify(currentLine))
          activitiesOnLine.forEach(activity => {
            console.log(JSON.stringify(activity))
            this.rest.modifyActivity(activity['sku']['_id'], activity['sku']['_id'], activity['numcases'],activity['calculatedhours'],activity['sethours'], activity['startdate'], currentLine['_id']).subscribe(response => {
              console.log("Adding activity " + activity['sku']['skuname'] + " to line " + event.container.id)
              console.log("RESPONSE: " + JSON.stringify(response))
            })
            this.calculateEndDate(activity);
          })
          
        })
        
        // this.updateProductLine(event.previousContainer.id, 
        //     event.previousContainer.id, event.previousContainer.data)
        // this.updateProductLine(event.container.id,
        //     event.container.id, event.container.data);
    }
  }

  calculateEndDate(activity) {
    
    let initialEndDate = activity['startdate'] + new Date((activity['sethours'] / 10));
    var duration = moment().isoWeekdayCalc(activity['startdate'],initialEndDate,[1,2,3,4,5]);
    if (duration > (initialEndDate-activity['startdate'])) {
      this.endDate = new Date(Math.floor(duration - (initialEndDate-activity['startdate']) + (activity['sethours'] / 10)))
    }
    else {
      this.endDate = new Date(duration + activity['startdate'])
    }
    this.startDate = new Date(activity['startdate'])
    this.startDate.toDateString();
    this.endDate.toDateString();

    // var month = this.startDate.getUTCMonth() + 1; //months from 1-12
    // var day = this.startDate.getUTCDate();
    // var year = this.startDate.getUTCFullYear();
    // this.startDateString = year + "/" + month + "/" + day;

    // var month2 = this.endDate.getUTCMonth() + 1; //months from 1-12
    // var day2 = this.endDate.getUTCDate();
    // var year2 = this.endDate.getUTCFullYear();
    // this.endDateString = year2 + "/" + month2 + "/" + day2;
    // console.log(this.endDateString)
  }

  updateActivity(activity, line) {
    return new Promise((resolve, reject) => {
      this.rest.modifyActivity(activity['sku']['_id'], activity['sku']['_id'], 
      activity['numcases'], activity['calculatedhours'], 
      activity['sethours'], activity['startdate'], line).subscribe(modifyPLResponse => {
        if (modifyPLResponse['ok'] == 1) {
            console.log('success')
            resolve();
        } else {
            console.log('failure')
            reject(Error("Could not modify Activity " + activity));
        }     
    });
  });
}

}

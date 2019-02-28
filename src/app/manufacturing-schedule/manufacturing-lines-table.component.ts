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
  constructor(public rest: RestService, public dialog: MatDialog) { }


  propagateChange: any = () => { };

  @Input() label: string;

  writeValue(value: any) {
    if (value) {
      this._value = value;
      this.stringified = JSON.stringify(value);
      if(this._value['activities'].length > 0){
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
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
        let activitiesOnLine = event.container.data;
        console.log("The Data: ",event.container.data);
        // this.rest.getLine('','',event.container.id, event.container.id, 1).subscribe(response => {
        //   let currentLine = response[0];
        //   var numActivitiesFinished = 0;
        //   activitiesOnLine.forEach(activity => {
        //     this.rest.modifyActivity(activity['sku']['_id'], activity['sku']['_id'], activity['numcases'],activity['calculatedhours'],activity['sethours'], activity['startdate'], currentLine['_id']).subscribe(response => {
        //       console.log("Adding activity " + activity['sku']['skuname'] + " to line " + event.container.id);
        //       numActivitiesFinished++;
        //       if (numActivitiesFinished >= activitiesOnLine.length) {
        //         var shouldRefresh = false;
        //         for(var i = 0; i < event.container.data.length; i++) {
        //           if (!event.container.data[i]['line']) {
        //             shouldRefresh = true;
        //           }
        //         }
        //         if (shouldRefresh) {
        //           window.location.replace(window.location.href);
        //         }
        //       }
        //     })
        //   })
          
        // })
        
    }
  }



  updateActivity(activity, line) {
    return new Promise((resolve, reject) => {
    //   this.rest.modifyActivity(activity['sku']['_id'], activity['sku']['_id'], 
    //   activity['numcases'], activity['calculatedhours'], 
    //   activity['sethours'], activity['startdate'], line).subscribe(modifyPLResponse => {
    //     if (modifyPLResponse['ok'] == 1) {
    //         console.log('success')
    //         resolve();
    //     } else {
    //         console.log('failure')
    //         reject(Error("Could not modify Activity " + activity));
    //     }     
    // });
  });
}

}

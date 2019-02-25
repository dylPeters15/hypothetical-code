import { Component, Input, forwardRef, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { RestService } from '../rest.service';
import { MatDialog, MatDialogRef, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { ModifyActivityDialogComponent } from '../modify-activity-dialog/modify-activity-dialog.component'


const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ManufactoringScheduleTableComponent),
  multi: true
};

@Component({
  selector: 'app-manufacturing-schedule-tables',
  templateUrl: './manufacturing-schedule-tables.component.html',
  styleUrls: ['./manufacturing-schedule-tables.component.css'],
  providers: [customValueProvider]
})
export class ManufactoringScheduleTableComponent implements ControlValueAccessor {


  modifyActivityDialogRef: MatDialogRef<ModifyActivityDialogComponent>;
  constructor(public rest: RestService, public dialog: MatDialog) { }
  _value = '';
  stringified = '';

  propagateChange: any = () => { };

  @Input() label: string;

  writeValue(value: any) {
    if (value) {
      this._value = value;
      this.stringified = JSON.stringify(value);
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

  modifySelectedActivity(activity) {
    this.modifyManufacturingActivityConfirmed(activity); 
    }

    modifyManufacturingActivityConfirmed(activity) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {activity: activity};
      this.modifyActivityDialogRef = this.dialog.open(ModifyActivityDialogComponent, dialogConfig);
      this.modifyActivityDialogRef.afterClosed().subscribe(event => {
        // this.refreshData();
      });
    }

  drop(event: CdkDragDrop<string[]>) {
    console.log('previous container id',event.previousContainer)
    console.log('container id',event.container)
    console.log('container data',event.container.data)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      var isValidMove = false;
      let promise =  new Promise((resolve, reject) => {
        // let splitId = event.previousContainer.id.split(",")
        this.rest.getLine("", "", event.previousContainer.id, "", 1).subscribe(line => {
              if (line['shortname'] == event.previousContainer.id) {
                console.log(event.previousContainer.id, line)
                isValidMove = true;
                resolve(line);
              }
              else {
                isValidMove = false;
                resolve(line)
              }
            });
        });
      promise.then((line) => {
        if (isValidMove) {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
          
          this.updateActivity(event)
        }
        else {
          console.log("not valid");
        }
      })
    }
  }
/* Hi this method is buggy */
  updateActivity(event) {
    return new Promise((resolve, reject) => {
      this.rest.getGoals("", "", "", true, 5).subscribe(goals => {
        if (goals) {
          goals.forEach((goal) => {
            var activities = goal['activities'];
            console.log(activities)
            activities.forEach((activity) => {
              if (activity['_id'] == event.previousContainer.data[event.previousIndex]['_id']) {
                this.rest.modifyActivity(activity['sku']['_id'], activity['sku']['_id'], 
                activity['numcases'], activity['calculatedhours'], 
                activity['sethours'], activity['startdate'], null).subscribe(modifyPLResponse => {
                  if (modifyPLResponse['ok'] == 1) {
                      console.log('success')
                      resolve();
                  } else {
                      console.log('failure')
                      reject(Error("Could not modify Activity " + activity));
                  }     
              });
              }
              console.log("Must move activity to proper goal")
              resolve();
            })

          });
        }
      })
    })
    
  }

}

import { Component, Input, forwardRef, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { RestService } from '../rest.service';
import {RestServiceV2, AndVsOr} from '../restv2.service'
import { MatDialog, MatDialogRef, MatTableDataSource, MatPaginator } from "@angular/material";
import {MatIconModule} from '@angular/material/icon'

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ManufacturingGoalsTablesComponent),
  multi: true
};

@Component({
  selector: 'app-manufacturing-goals-tables',
  templateUrl: './manufacturing-goals-tables-component.html',
  styleUrls: ['./manufacturing-goals-tables-component.css'],
  providers: [customValueProvider]
})
export class ManufacturingGoalsTablesComponent implements ControlValueAccessor {

  constructor(public restv2: RestServiceV2, public rest: RestService, public dialog: MatDialog) { }
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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
        console.log('previous container id',event.previousContainer.id)
        console.log('container id',event.container.id)
        console.log('container goals',event.container.data)
        this.updateGoals(event.previousContainer.id, 
            event.previousContainer.id, event.previousContainer.data)
        this.updateGoals(event.container.id,
            event.container.id, event.container.data);
    }
  }

  updateGoals(oldEnabledStatus, newEnabledStatus, goal) {
    let enabledStatus: boolean;
   if(newEnabledStatus == "Enabled"){
      enabledStatus = true;
   }
   else{
     enabledStatus = false;
   }
    
    return new Promise((resolve, reject) => {
      goal.forEach(element => {
        this.rest.modifyGoal(element['goalname'],element['goalname'],element['activities'],element['date'],enabledStatus).subscribe(modifyPLResponse => {
          if (modifyPLResponse['ok'] == 1) {
              console.log('success')
              resolve();
          } else {
              console.log('failure')
              reject(Error("Could not modify Goal " + goal['goalname']));
          }     
      });
  });
      });
    
  }
}



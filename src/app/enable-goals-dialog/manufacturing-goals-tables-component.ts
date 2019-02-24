import { Component, Input, forwardRef, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { RestService } from '../rest.service';
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
        console.log('container skus',event.container.data)
        this.updateManufacturingSchedule(event.previousContainer.id, 
            event.previousContainer.id, event.previousContainer.data)
        this.updateManufacturingSchedule(event.container.id,
            event.container.id, event.container.data);
    }
  }

  updateManufacturingSchedule(oldname, newname, skus) {
//     return new Promise((resolve, reject) => {
//     // this.rest.modifyManufacturingSchedule(oldname,
//     //     newname, skus).subscribe(modifyPLResponse => {
//     //         if (modifyPLResponse['ok'] == 1) {
//     //             console.log('success')
//     //             resolve();
//     //         } else {
//     //             console.log('failure')
//     //             reject(Error("Could not modify Product Line " + oldname));
//     //         }     
//     //     });
//     // });
//   }
}

}

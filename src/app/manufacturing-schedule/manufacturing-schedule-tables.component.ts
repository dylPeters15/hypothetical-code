import { Component, Input, forwardRef, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { RestService } from '../rest.service';
import { MatDialog, MatDialogRef, MatTableDataSource, MatPaginator } from "@angular/material";
import {NewProductLineDialogComponent } from '../new-product-line-dialog/new-product-line-dialog.component';
import {MatIconModule} from '@angular/material/icon'

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
    console.log('previous container id',event.previousContainer)
    console.log('container id',event.container)
    console.log('container data',event.container.data)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
        // console.log('previous container id',event.previousContainer.id)
        // console.log('container id',event.container.id)
        // console.log('container skus',event.container.data)
        // this.updateProductLine(event.previousContainer.id, 
        //     event.previousContainer.id, event.previousContainer.data)
        // this.updateProductLine(event.container.id,
        //     event.container.id, event.container.data);
    }
  }

//   updateProductLine(oldname, newname, skus) {
//     return new Promise((resolve, reject) => {
//     this.rest.modifyProductLine(oldname,
//         newname, skus).subscribe(modifyPLResponse => {
//             if (modifyPLResponse['ok'] == 1) {
//                 console.log('success')
//                 resolve();
//             } else {
//                 console.log('failure')
//                 reject(Error("Could not modify Product Line " + oldname));
//             }     
//         });
//     });
//   }

}

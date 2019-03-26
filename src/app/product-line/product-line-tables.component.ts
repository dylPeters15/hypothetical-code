import { Component, Input, forwardRef, Inject, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { RestService } from '../rest.service';
import { MatDialog,MatSnackBar, MatDialogRef, MatTableDataSource, MatPaginator } from "@angular/material";
import {NewProductLineDialogComponent } from '../new-product-line-dialog/new-product-line-dialog.component';
import {MatIconModule} from '@angular/material/icon'
import { auth } from '../auth.service';
import { RestServiceV2, AndVsOr } from '../restv2.service';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProductLineTablesComponent),
  multi: true
};

@Component({
  selector: 'app-product-line-tables',
  templateUrl: './product-line-tables.component.html',
  styleUrls: ['./product-line-tables.component.css'],
  providers: [customValueProvider]
})
export class ProductLineTablesComponent implements ControlValueAccessor, OnInit {

  admin: boolean = false;
  nameExists: boolean = false;

  constructor( private snackBar: MatSnackBar,public restv2: RestServiceV2, public rest: RestService, public dialog: MatDialog) { }

  ngOnInit() {
    this.admin = auth.isAuthenticatedForAdminOperation();
  }

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

   async modifyName(event: Event) {
    let oldname = this._value['productlinename'];
    const dialogRef = this.dialog.open(NewProductLineDialogComponent, {
      width: '250px',
      data: {productlinename: this._value['productlinename']},
      disableClose: true 
    }); 
    var existingLines = [];
    var allProductLines = await this.restv2.getProductLines(AndVsOr.OR, null, ".*",1000);
    allProductLines.forEach(productLine => {
      existingLines.push(productLine['productlinename'])
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if(existingLines.indexOf(result) != -1){
          this.snackBar.open("Unable to modify. Name " + result + " already exists.", "close", {
            duration: 2000,
          });
        }
        else{
          this._value['productlinename'] = result;
          return new Promise((resolve, reject) => {
            this.rest.getProductLines(oldname,"",1).subscribe(results => {
              if (results != null) {
                this.updateProductLine(oldname, result, results[0].skus);
              }
              resolve();
            })
          })
        }
      }      
    });
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
        this.updateProductLine(event.previousContainer.id, 
            event.previousContainer.id, event.previousContainer.data)
        this.updateProductLine(event.container.id,
            event.container.id, event.container.data);
    }
  }

  updateProductLine(oldname, newname, skus) {
    return new Promise((resolve, reject) => {
    this.rest.modifyProductLine(oldname,
        newname, skus).subscribe(modifyPLResponse => {
            if (modifyPLResponse['ok'] == 1) {
                console.log('success')
                resolve();
            } else {
                console.log('failure')
                reject(Error("Could not modify Product Line " + oldname));
            }     
        });
    });
  }

}

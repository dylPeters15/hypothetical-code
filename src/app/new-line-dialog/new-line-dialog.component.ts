import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-new-line-dialog',
  templateUrl: './new-line-dialog.component.html',
  styleUrls: ['./new-line-dialog.component.css']
})
export class NewLineDialogComponent implements OnInit {
  dialog_title: String;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skuCtrl = new FormControl();
  filteredSkus: Observable<String[]>;
  linename: string = '';
  shortname: string = '';
  selectedSkuNames: string[] = [];
  selectedSkus: any = [];
  comment: string = '';
  skuList: any = [];
  skuNameList: string[] = [];
  edit: Boolean;

  @ViewChild('skuInput') skuInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewLineDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { 
    this.filteredSkus = this.skuCtrl.valueChanges.pipe(
      startWith(null),
      map((sku: string | null) => sku ? this._filter(sku) : this.skuNameList.slice()));
  }

  ngOnInit() {
    this.edit = this.data.edit;
    this.linename = this.data.present_linename;
    this.shortname = this.data.present_shortname;
    // this.selectedSkus = this.data.present_skus;
    this.comment = this.data.present_comment;
    console.log("EDIT: " + this.edit)
    // edit == true if sku is being modified, false if a new sku is being created
    if (this.edit == true)
    {
      this.dialog_title = "Modify Product Line";
    }
    else {
      this.dialog_title = "Create New Product Line";
    }
    this.rest.getSkus('', '.*',0,0,0,'',5).subscribe(response => {
        this.skuList = response;
        this.skuList.forEach(element => {
          this.skuNameList.push(element.skuname)
        });
      });
  }

  closeDialog() {
    this.dialogRef.close();
    this.linename = '';
    this.selectedSkuNames = [];
    this.skuList = [];
    this.selectedSkus = [];
    this.skuNameList = [];
    this.shortname = '';
    this.comment = '';
  }

  createLine() {
    if(this.edit == false){
      this.rest.createLine(this.linename, this.shortname, this.selectedSkus, this.comment).subscribe(response => {
        this.snackBar.open("Successfully created Line: " + this.linename + ".", "close", {
          duration: 2000,
        });
      //   console.log(response);
      //   this.snackBar.open("Error creating Line: " + this.linename + ". Please refresh and try again.", "close", {
      //     duration: 2000,
      //   });
      // }
        this.closeDialog();
      });
    }
    else{
      this.rest.modifyLine(this.data.present_linename, this.linename, this.shortname, this.selectedSkus, this.comment).subscribe(response => {
        this.snackBar.open("Successfully modified Line: " + this.linename + ".", "close", {
          duration: 2000,
        });
        this.closeDialog();
      });
    }
  }

  add(event: MatChipInputEvent): void {
    // Add sku only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;


      // Add our sku
      if ((value || '').trim()) {
        this.selectedSkuNames.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.skuCtrl.setValue(null);
    }
  }

  remove(sku: string): void {
    const index = this.selectedSkuNames.indexOf(sku);

    if (index >= 0) {
      this.selectedSkuNames.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedSkuNames.push(event.option.viewValue);
    console.log(event.option.viewValue)
    this.rest.getSkus(event.option.viewValue, '', 0,0,0,'',5).subscribe(response => {
      var i;
      for(i = 0; i<response.length; i++){
        this.selectedSkus.push({sku: response[i]['_id']})
      }

      
    });
    this.skuInput.nativeElement.value = '';
    this.skuCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.skuNameList.filter(sku => sku.toLowerCase().indexOf(filterValue) === 0);
  }
}
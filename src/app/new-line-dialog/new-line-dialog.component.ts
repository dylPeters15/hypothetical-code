
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef} from "@angular/material";
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
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skuCtrl = new FormControl();
  filteredSkus: Observable<String[]>;
  linename: string = '';
  shortname: string = '';
  selectedSkus: any = [];
  comment: string = '';
  skuList: any = [];
  skuNameList: String[] = [];

  @ViewChild('skuInput') skuInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private dialogRef: MatDialogRef<NewLineDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { 
    this.filteredSkus = this.skuCtrl.valueChanges.pipe(
      startWith(null),
      map((sku: string | null) => sku ? this._filter(sku) : this.skuNameList.slice()));
  }

  ngOnInit() {
    this.rest.getSkus('Tomato Soup',2,1395233994,163728391922,'5c6b4d269e971610f3e09f93',5).subscribe(response => {
        this.skuList = response;
        this.skuList.forEach(element => {
          this.skuNameList.push(element.skuname)
        });
      });
  }

  closeDialog() {
    this.dialogRef.close();
    this.linename = '';
    this.selectedSkus = [];
    this.shortname = '';
    this.comment = '';
  }

  createLine() {
    this.rest.createLine(this.linename, this.shortname, this.selectedSkus, this.comment).subscribe(response => {
      if (response['success']) {
        this.snackBar.open("Successfully created Line: " + this.linename + ".", "close", {
          duration: 2000,
        });
      } else {
        this.snackBar.open("Error creating Line: " + this.linename + ". Please refresh and try again.", "close", {
          duration: 2000,
        });
      }
      this.closeDialog();
    });
  }

  add(event: MatChipInputEvent): void {
    // Add sku only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our sku
      if ((value || '').trim()) {
        console.log("adding: " + value.trim());
        this.selectedSkus.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.skuCtrl.setValue(null);
    }
  }

  remove(sku: string): void {
    const index = this.selectedSkus.indexOf(sku);

    if (index >= 0) {
      this.selectedSkus.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedSkus.push(event.option.viewValue);
    this.skuInput.nativeElement.value = '';
    this.skuCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.skuList.filter(sku => sku.toLowerCase().indexOf(filterValue) === 0);
  }
}

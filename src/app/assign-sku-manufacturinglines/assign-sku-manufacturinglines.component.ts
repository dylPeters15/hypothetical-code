import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import {FormControl, FormGroupDirective} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { RestServiceV2, AndVsOr } from '../restv2.service';

@Component({
  selector: 'app-assign-sku-manufacturinglines',
  templateUrl: './assign-sku-manufacturinglines.component.html',
  styleUrls: ['./assign-sku-manufacturinglines.component.css']
})
export class AssignSkuManufacturingLines implements OnInit {
  dialog_title: String;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  lineCtrl = new FormControl();
  filteredLines: Observable<string[]> = new Observable(observer => {
    this.lineCtrl.valueChanges.subscribe(async newVal => {
      observer.next(await this.restv2.getLine(AndVsOr.OR, null, "(?i).*"+newVal+".*",null,"(?i).*"+newVal+".*",1000));
    });
  });
  currentSku: any;
  //linename: string = '';
  //shortname: string = '';
  selectedLineNames: string[] = [];
  selectedLines: any = [];
  //comment: string = '';
  lineList: any = [];
  lineNameList: string[] = [];
  edit: Boolean;

  @ViewChild('lineInput') lineInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public restv2: RestServiceV2, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AssignSkuManufacturingLines>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.edit = this.data.edit;
    this.currentSku = this.data.present_sku;

    // edit == true if sku is being modified, false if a new sku is being created
    if (this.edit == true)
    {
      if(this.data.present_lines != ""){
        let linesArray = this.data.present_lines.split(',');
        linesArray.forEach(lineString => {
          let colonIndex = lineString.indexOf(':');
          let line = lineString.substring(0,colonIndex);
          
          this.selectedLineNames.push(line);
          this.rest.getLine(line,line,'', '', 100).subscribe(response=>{
            if(response[0] != undefined){
              let currentLine = response[0];
              console.log("WAHAHAHAHAHAA: " + currentLine['shortname']);
              console.log("Line: " + JSON.stringify(currentLine))
              this.selectedLines.push({line: currentLine['_id']});
            }
          })
      });
      }
    
     
      this.dialog_title = "Modify Manufacturing Lines";
    }
    else {
      this.dialog_title = "Assign Manufacturing Lines";
    }
    
    this.rest.getLine('', '.*','','',100).subscribe(response => {
        this.lineList = response;
        this.lineList.forEach(element => {
          this.lineNameList.push(element.linename)
        });
      });
  }

  cancel() {
    this.selectedLines = [];
    this.closeDialog();
  }

  assignLines() {
    this.dialogRef.componentInstance.selectedLines = this.selectedLines;
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
    //this.selectedLineNames = [];
    //this.lineList = [];
    //this.selectedLines = [];
    //this.lineNameList = [];
  }

  add(event: MatChipInputEvent): void {
    // Add line only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;


      // Add our sku
      if ((value || '').trim()) {
        this.selectedLineNames.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.lineCtrl.setValue(null);
    }
  }

  remove(line: string): void {
    const index = this.selectedLineNames.indexOf(line);
    if (index >= 0) {
      this.selectedLineNames.splice(index, 1);
    }
    this.rest.getLine(line,line,'', '', 100).subscribe(response=>{
      if(response != undefined){
        console.log(this.selectedLines)
        const lineIndex = this.selectedLines.indexOf(response[0]['_id']);
        this.selectedLines.splice(lineIndex,1);
      }

    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let linename = event.option.viewValue.split(" ")[0];
    this.selectedLineNames.push(linename);
    this.rest.getLine(linename, '', '','',5).subscribe(response => {
      var i;
      for(i = 0; i<response.length; i++){
        console.log("SELECTED ONE");
        console.log("added one is " + response[i]);
        this.selectedLines.push(response[i])
      }

      
    });
    this.lineInput.nativeElement.value = '';
    this.lineCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.lineNameList.filter(line => line.toLowerCase().indexOf(filterValue) === 0);
  }
}
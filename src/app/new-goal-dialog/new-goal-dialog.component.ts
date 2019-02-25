
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatDatepickerInputEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

export class DisplayableActivity{
  skuname: string = '';
  hours: number;

  constructor(hours, skuname){
    this.hours = hours;
    this.skuname = skuname;
  }
}

@Component({
  selector: 'app-new-goal-dialog',
  templateUrl: './new-goal-dialog.component.html',
  styleUrls: ['./new-goal-dialog.component.css']
})


export class NewGoalDialogComponent implements OnInit {
  dialog_title: String;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skuCtrl = new FormControl();
  filteredSkus: Observable<String[]>;
  name: string = '';
  quantity: number;
  shortname: string = '';
  selectedSkuNames: string[] = [];
  selectedSkus: any = [];
  currentSku: any;
  displayableActivities: any = [];
  activityIds: any = [];
  date: Date;
  skuList: any = [];
  skuNameList: string[] = [];
  edit: Boolean;

  @ViewChild('skuInput') skuInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewGoalDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { 
    this.filteredSkus = this.skuCtrl.valueChanges.pipe(
      startWith(null),
      map((sku: string | null) => sku ? this._filter(sku) : this.skuNameList.slice()));
  }

  ngOnInit() {
    this.edit = this.data.edit;
    this.name = this.data.present_name;
    // this.selectedSkus = this.data.present_skus;
    this.date = this.data.present_date;
    console.log("EDIT: " + this.edit)
    // edit == true if goal is being modified, false if a new sku is being created
    if (this.edit == true)
    {
      this.dialog_title = "Modify Manufacturing Goal";
    }
    else {
      this.dialog_title = "Create New Manufacturing Goal";
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
    this.selectedSkuNames = [];
    this.skuList = [];
    this.selectedSkus = [];
    this.skuNameList = [];
    this.shortname = '';
    this.date = null;
  }

  addActivity(){
    var hours = this.quantity/this.currentSku['manufacturingrate'];
    let newActivity = new DisplayableActivity(hours, this.currentSku['skuname']);
    this.displayableActivities.push(newActivity);
    this.rest.createActivity(this.currentSku['_id'], this.quantity, hours, null,new Date(),null).subscribe(response => {
      this.activityIds.push({activity: response['_id']});
      this.snackBar.open("Successfully created Activity: " + this.currentSku['skuname'] + ".", "close", {
              duration: 2000,
            });
    });
  }

  createGoal() {
    if(this.edit == false){
      console.log(this.activityIds)
      this.rest.createGoal(this.name, this.activityIds, this.date, false).then(response => {
        this.snackBar.open("Successfully created Goal: " + this.name + ".", "close", {
          duration: 2000,
        }
        );
        console.log(response);
        this.closeDialog();
      }).catch(err => {
        this.snackBar.open("Error creating Goal: " + this.name + ". Please refresh and try again.", "close", {
          duration: 2000,
        });
        console.log(err)
      });
    }
    else{
      this.rest.modifyGoal(this.data.present_name, this.name, this.activityIds, this.date, false).subscribe(response => {
        this.snackBar.open("Successfully modified Line: " + this.name + ".", "close", {
          duration: 2000,
        });
        this.closeDialog();
      });
    }
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedSkuNames.push(event.option.viewValue);

    this.rest.getSkus(event.option.viewValue, '', 0,0,0,'',5).subscribe(response => {
      var i;
      for(i = 0; i<response.length; i++){
        this.selectedSkus.push({sku: response[i]['_id']})
        this.currentSku = response[i];
      }

      
    });
    this.skuInput.nativeElement.value = '';
    this.skuCtrl.setValue(event.option.viewValue);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.skuNameList.filter(sku => sku.toLowerCase().indexOf(filterValue) === 0);
  }

  addDate(type:string, event: MatDatepickerInputEvent<Date>){
    this.date = event.value;
  }
}
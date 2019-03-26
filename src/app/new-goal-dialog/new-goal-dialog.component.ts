import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatDatepickerInputEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { RestServiceV2, AndVsOr } from '../restv2.service';

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
  filteredSkus: Observable<string[]> = new Observable(observer => {
    this.skuCtrl.valueChanges.subscribe(async newVal => {
      observer.next(await this.restv2.getSkus(AndVsOr.AND, null, "(?i).*"+newVal+".*", null,null,null,null,1000));
    });
  });
  name: string = '';
  quantity: number;
  shortname: string = '';
  selectedSkuNames: string[] = [];
  selectedSkus: any = [];
  currentSku: any;
  displayableActivities: any = [];
  activityIds: any = [];
  date: Date;
  dateCtrl: FormControl;
  skuList: any = [];
  skuNameList: string[] = [];
  edit: Boolean;

  @ViewChild('skuInput') skuInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public restv2: RestServiceV2,@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewGoalDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log("IDS: " + this.activityIds)
    this.edit = this.data.edit;
    if(this.edit == true){
      this.name = this.data.present_name;
      this.displayableActivities = this.data.present_activities;
      
      if(this.displayableActivities.length> 0){
        this.rest.getActivities(null, 100).subscribe(response => {
          response.forEach(activityInDatabase => {
            this.displayableActivities.forEach(element => {
              console.log("Act: " + activityInDatabase['sku']['skuname'])
              console.log("ELEMENT:" + element.skuname)
              if(activityInDatabase['sku']['skuname'] == element.skuname && activityInDatabase['calculatedhours'] == Number(element.hours) && this.activityIds.indexOf(activityInDatabase['_id']) == -1){
                this.activityIds.push({activity: activityInDatabase['_id']})
              }
            })
            });
      
        })
      }
      console.log("Array: " + JSON.stringify(this.displayableActivities))
     
      this.dialog_title = "Modify Manufacturing Goal";
    }
    else {
      this.dialog_title = "Create New Manufacturing Goal";
    }
    this.date = new Date(this.data.present_date);
    console.log("DATE: " + this.date.toString())
    this.dateCtrl = new FormControl(this.date)
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
    this.quantity = null;
  }

  addActivity(){
    var hours = Math.ceil(this.quantity/this.currentSku['manufacturingrate']);
    let newActivity = new DisplayableActivity(hours, this.currentSku['skuname']);
    
    this.displayableActivities.push(newActivity);
    
    this.rest.createActivity(this.currentSku['_id'], this.quantity, hours, null,new Date(),null).subscribe(response => {
      this.activityIds.push({activity: response['_id']});
      this.snackBar.open("Successfully created Activity: " + this.currentSku['skuname'] + ".", "close", {
              duration: 2000,
            });
      this.skuCtrl.setValue(null);
      this.quantity = null;
    });

  }

  createGoal() {
    if(this.edit == false){
      this.rest.createGoal(this.name, this.activityIds, this.date, false).then(response => {
        this.snackBar.open("Successfully created Goal: " + this.name + ".", "close", {
          duration: 2000,
        }
        );
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
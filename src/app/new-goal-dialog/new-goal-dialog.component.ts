import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import { RestService } from '../rest.service';
import { MatDialog, MatDialogConfig, MatSnackBar, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatDatepickerInputEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { SalesProjectionComponent } from '../sales-projection/sales-projection.component';

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
  activities: any = [];
  date: Date;
  dateCtrl: FormControl;
  skuList: any = [];
  skuNameList: string[] = [];
  edit: Boolean;
  create_title: String;
  projectionDialogRef: MatDialogRef<SalesProjectionComponent>;

  @ViewChild('skuInput') skuInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private dialog: MatDialog, public restv2: RestServiceV2,@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewGoalDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.edit = this.data.edit;
    if(this.edit == true){
      this.name = this.data.present_name;
      this.activities = this.data.present_activities;
      
      if(this.activities.length> 0){
            this.activities.forEach(element => {
              let hours = element['sethours'] != null ? element['sethours'] : element['calculatedhours'];
              let activityString = new DisplayableActivity(hours, element['sku']['skuname'])
              this.activityIds.push({activity: element['_id']});
              this.displayableActivities.push(activityString);
            })
      }
     
      this.dialog_title = "Modify Manufacturing Goal";
      this.create_title = "Save Changes";
    }
    else {
      this.dialog_title = "Create New Manufacturing Goal";
      this.create_title = "Create";
    }
    this.date = new Date(this.data.present_date);
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

  async addActivity(){
    var hours = Math.ceil(this.quantity/this.currentSku['manufacturingrate']);
    let newActivity = new DisplayableActivity(hours, this.currentSku['skuname']);
    
    this.displayableActivities.push(newActivity);
    var newActivityObject = await this.restv2.createActivity(this.currentSku['_id'], this.quantity, hours, null,new Date(),null);
    if(this.activityIds.indexOf({activity: newActivityObject['_id']}) == -1){
      this.activityIds.push({activity: newActivityObject['_id']});
    }
    this.snackBar.open("Successfully created Activity: " + this.currentSku['skuname'] + ".", "close", {
              duration: 2000,
          });
    this.skuCtrl.setValue(null);
    this.currentSku = null;
    this.quantity = null;
    
  }

  createGoal() {
    if(this.edit == false){
      this.restv2.createGoal(this.name, this.activityIds, this.date, false).then(response => {
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
      this.restv2.modifyGoal(AndVsOr.OR, this.data.present_name, this.name, this.activityIds, this.date, this.data.present_enabled).then(response => {
        this.snackBar.open("Successfully modified Goal: " + this.name + ".", "close", {
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

  async openProjection(currentSku){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {sku: currentSku};
      this.projectionDialogRef = this.dialog.open(SalesProjectionComponent, dialogConfig);
      this.projectionDialogRef.afterClosed().subscribe(async event => {
        if(event['average'] != null){
          this.quantity = event['average'];
        }
        
      })
    }
  }
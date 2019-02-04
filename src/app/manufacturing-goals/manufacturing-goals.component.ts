import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource,MatPaginator } from "@angular/material";

export class ManufacturingGoal {
  skus: any = [];
  quantities: any = [];
  name: String;
  date: String;
  constructor(name, skus, quantities, date){
    this.name = name;
    this.skus = skus;
    this.quantities = quantities;
    this.date = date;
  }
}

@Component({
  selector: 'app-manufacturing-goals',
  templateUrl: './manufacturing-goals.component.html',
  styleUrls: ['./manufacturing-goals.component.css']
})

export class ManufacturingGoalsComponent implements OnInit {
  allReplacement = 54321;
  goals:any = [];
  displayedColumns: string[] = ['name', 'skus','quantities', 'date'];
  data: ManufacturingGoal[] = [];
  dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // newDialogRef: MatDialogRef<NewGoalComponent>;

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) {  }

  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  ngOnInit() {
    this.data = [];
    this.rest.getGoals().subscribe(data => {
        this.goals = data;
        var i;
        this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
        for(i = 0; i<this.goals.length; i++){
          let name = this.goals[i]['name'];
          let skus = this.goals[i]['skus'];
          let quantities = this.goals[i]['quantities'];
          let date = this.goals[i]['date'];
          let currentGoal = new ManufacturingGoal(name, skus, quantities, date);
          this.data.push(currentGoal);
        }
        this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
        this.dataSource.paginator = this.paginator;
    })

  }

}

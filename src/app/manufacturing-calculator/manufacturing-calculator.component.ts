import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manufacturing-calculator',
  templateUrl: './manufacturing-calculator.component.html',
  styleUrls: ['./manufacturing-calculator.component.css']
})
export class ManufacturingCalculatorComponent implements OnInit {
  goals: any = [];

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  this.rest.getGoals().subscribe(data => {
    this.goals = data;
  });
  }

}

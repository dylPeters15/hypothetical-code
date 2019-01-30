import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sku-inventory',
  templateUrl: './sku-inventory.component.html',
  styleUrls: ['./sku-inventory.component.css']
})
export class SkuInventoryComponent implements OnInit {
  ingredients: any = [];

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  this.rest.getIngredients().subscribe(data => {
    this.ingredients = data;
  });
  }

}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sku-inventory',
  templateUrl: './sku-inventory.component.html',
  styleUrls: ['./sku-inventory.component.css']
})
export class SkuInventoryComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}

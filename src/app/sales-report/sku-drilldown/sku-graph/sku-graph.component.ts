import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sku-graph',
  templateUrl: './sku-graph.component.html',
  styleUrls: ['./sku-graph.component.css']
})
export class SkuGraphComponent implements OnInit {

  data = "2009/07/12,100,200\n" +
  "2009/07/19,150,201\n";
  options = { labels: [ "Date", "Series1", "Series2" ] };

  constructor() { }

  ngOnInit() {
  }

}

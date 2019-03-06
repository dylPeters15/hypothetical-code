import { Component, OnInit, ViewChild } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';
// import { PopoverModule, PopoverConfig, PopoverDirective } from 'ngx-bootstrap';
declare var vis:any;

@Component({
  selector: 'app-vis',
  templateUrl: './vis.component.html',
  styleUrls: ['./vis.component.css']
})
export class VisComponent implements OnInit {
  @ViewChild("siteConfigNetwork") networkContainer: ElementRef;
  @ViewChild("pop") popOver: any;
  public network: any;

  constructor() { }

  ngOnInit() {
    var treeData = this.getTreeData();
    this.loadVisTree(treeData);
  }

  loadVisTree(treedata) {
    var options = {
      interaction: {
        hover: true,
      },
      manipulation: {
				enabled: true
			}
    };
    var container = this.networkContainer.nativeElement;
    this.network = new vis.Network(container, treedata, options);

    var that = this;
    this.network.on("hoverNode", function (params) {      
      //popOver.nativeElement.show();
      that.popOver.show();
      console.log('hoverNode Event:', params);
    });
    this.network.on("blurNode", function(params){
      console.log('blurNode event:', params);
      that.popOver.hide();
    });
  }

  getTreeData() {
// create an array with nodes
    var nodes =[
        {id: 1, label: 'Node 1', title: 'I am node 1!'},
        {id: 2, label: 'Node 2', title: 'I am node 2!'},
        {id: 3, label: 'Node 3'},
        {id: 4, label: 'Node 4'},
        {id: 5, label: 'Node 5'}
    ];

    // create an array with edges
    var edges = [
        {from: 1, to: 3},
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 2, to: 5}
    ];
    var treeData = {
      nodes: nodes,
      edges: edges
    };
    return treeData;
  }
}
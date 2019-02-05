import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hypothetical-code';

  ngOnInit() {
    if (location.protocol === 'http:') {
      window.location.href = location.href.replace('http', 'https');
    }
  }
  
}

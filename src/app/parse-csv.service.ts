import { Injectable } from '@angular/core';
import * as _ from 'csv-parse';

@Injectable({
  providedIn: 'root'
})
export class ParseCsvService {

  constructor() { }

  parseCSVFile(file) {
    return false;
  }

  parseCSVText(text) {

  }
}

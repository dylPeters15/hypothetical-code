import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ExistingRecordPreviewComponent),
  multi: true
};

@Component({
  selector: 'app-existing-record-preview',
  templateUrl: './existing-record-preview.component.html',
  styleUrls: ['./existing-record-preview.component.css'],
  providers: [customValueProvider]
})
export class ExistingRecordPreviewComponent implements ControlValueAccessor {

  constructor() { }

  _value = '';
  stringified = '';
  keys = [];

  propagateChange: any = () => { };

  @Input() label: string;

  writeValue(value: any) {
    if (value) {
      this._value = value;
      this.stringified = JSON.stringify(value);
      console.log("Value: ", value);
      this.keys = Object.keys(value[0]).filter((value, index, array) => {
        return !value.startsWith('_');
      });
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void { }

  onChange(event) {
    this.stringified = JSON.stringify(event.target.value);
    this.keys = Object.keys(event.target.value[0]).filter((value, index, array) => {
      return !value.startsWith('_');
    });
    this.propagateChange(event.target.value);
  }

}

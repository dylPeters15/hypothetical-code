import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImportPreviewSectionComponent),
  multi: true
};

@Component({
  selector: 'app-import-preview-section',
  templateUrl: './import-preview-section.component.html',
  styleUrls: ['./import-preview-section.component.css'],
  providers: [customValueProvider]
})
export class ImportPreviewSectionComponent implements ControlValueAccessor {

  constructor() { }

  _value = '';
  stringified = '';

  propagateChange: any = () => { };

  @Input() label: string;

  writeValue(value: any) {
    if (value) {
      this._value = value;
      this.stringified = JSON.stringify(value);
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void { }

  onChange(event) {
    this.stringified = JSON.stringify(event.target.value);
    this.propagateChange(event.target.value);
  }

}

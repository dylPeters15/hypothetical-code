import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImportConflictResolverComponent),
  multi: true
};

@Component({
  selector: 'app-import-conflict-resolver',
  templateUrl: './import-conflict-resolver.component.html',
  styleUrls: ['./import-conflict-resolver.component.css'],
  providers: [customValueProvider]
})
export class ImportConflictResolverComponent implements ControlValueAccessor {

  constructor() { }

  _value = '';

  propagateChange: any = () => { };

  @Input() label: string;

  writeValue(value: any) {
    if (value) {
      this._value = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void { }

  onChange(event) {
    this.propagateChange(event.target.value);
  }

}

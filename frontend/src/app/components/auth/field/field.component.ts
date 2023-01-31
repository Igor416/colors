import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  @Input() name!: string;
  @Input() placeholder!: string;
  @Input() autocomplete!: string;
  @Input() redirect!: string;
  @Input() redirectText!: string;
  @Input() value!: string | undefined;
  @Input() isPassword!: boolean;
  error!: string;
  @Input() original!: string | undefined;

  @Output() onChanged = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  emit() {
    this.onChanged.emit({value: this.value, field: this.name})
  }

  validate(): void {
    const passwordMinLen = 6;

    if (this.value != undefined) {
      if (this.value == '') {
        this.error = 'Empty field.';
        return;
      }
      if (this.value.includes(' ')) {
        this.error = `Invalid symbol occured (space).`;
        return;
      }
      if (this.isPassword && this.value.length < passwordMinLen) {
        this.error = `Min. length is ${passwordMinLen}.`;
        return;
      }
      if (this.original != undefined) {
        if (this.value != this.original) {
          this.error = `Passwords don't match.`;
          return;
        }
      }
    }
    this.error = '';
  }

  isValid(): boolean {
    return this.value != undefined && this.error == '';
  }

  getError(): string {
    this.validate();
    return this.error
  }
}

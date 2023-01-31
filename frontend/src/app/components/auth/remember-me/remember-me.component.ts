import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-remember-me',
  templateUrl: './remember-me.component.html',
  styleUrls: ['./remember-me.component.css']
})
export class RememberMeComponent implements OnInit {
  @Input() value!: boolean;
  @Output() onValueChanged = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  check() {
    this.onValueChanged.emit();
  }
}

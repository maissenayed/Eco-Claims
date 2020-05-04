import { Component, OnInit, Input } from '@angular/core'
@Component({
  selector: 'cui-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss'],
})
export class DonutComponent implements OnInit {
  @Input() name = 'Donut'
  @Input() type = 'default'
  @Input() color: string
  typeClass: string
  constructor() {}
  ngOnInit() {
    this.typeClass = this.type + 'Donut'
  }
}

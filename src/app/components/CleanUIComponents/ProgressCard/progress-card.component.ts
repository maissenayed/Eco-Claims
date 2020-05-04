import { Component, OnInit, Input } from '@angular/core'
@Component({
  selector: 'cui-progress-card',
  templateUrl: './progress-card.component.html',
  styleUrls: ['./progress-card.component.scss'],
})
export class ProgressCardComponent implements OnInit {
  @Input() title: string
  @Input() note: string
  @Input() currentValue: string
  @Input() percent: string
  @Input() dataColor: string
  constructor() {}
  ngOnInit() {}
}

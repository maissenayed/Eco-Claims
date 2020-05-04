import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'cui-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
})
export class ChartCardComponent implements OnInit {
  @Input() title: string
  @Input() amount: string
  @Input() chartOptions: any
  @Input() chartData: any

  constructor() {}
  ngOnInit() {}
}

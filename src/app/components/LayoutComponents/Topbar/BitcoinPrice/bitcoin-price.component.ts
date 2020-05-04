import { Component } from '@angular/core'

@Component({
  selector: 'cui-topbar-bitcoin-price',
  templateUrl: './bitcoin-price.component.html',
  styleUrls: ['./bitcoin-price.component.scss'],
})
export class TopbarBitcoinPriceComponent {
  chartData = {
    series: [[8, 20, 16, 10, 14, 17, 13, 25]],
  }
  chartOptions = {
    axisX: {
      showLabel: false,
      showGrid: false,
      offset: 0,
      labelOffset: {
        x: 0,
        y: 0,
      },
    },
    axisY: {
      showLabel: false,
      showGrid: false,
      offset: 0,
      labelOffset: {
        x: 0,
        y: 0,
      },
    },
    width: '90px',
    height: '50px',
    showPoint: false,
    showArea: true,
    low: 5,
  }
}

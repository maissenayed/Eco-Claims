import { Component, OnInit } from '@angular/core'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
const data: any = require('./data.json')
@Component({
  selector: 'app-dashboard-alpha',
  templateUrl: './alpha.component.html',
})
export class DashboardAlphaComponent implements OnInit {
  chartCard = data.chartCardData
  chartCardGraphOptions: object
  monthChartData = data.monthChartData
  monthChartOptions = {
    seriesBarDistance: 10,
    plugins: [
      ChartistTooltip({
        appendToBody: true,
      }),
    ],
  }
  constructor() {
    this.chartCardGraphOptions = {
      options: {
        axisX: {
          showLabel: false,
          showGrid: false,
          offset: 0,
        },
        axisY: {
          showLabel: false,
          showGrid: false,
          offset: 0,
        },
        showArea: true,
        high: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        fullWidth: true,
        height: '310px',
        showPoint: false,
      },
      low: 20,
      type: 'Line',
    }
  }
  ngOnInit() { }
 
}

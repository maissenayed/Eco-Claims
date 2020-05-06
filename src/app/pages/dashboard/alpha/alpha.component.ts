import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import { ClaimsService } from 'src/app/services/firebaseServices/claims.service'
const data: any = require('./data.json')

@Component({
  selector: 'app-dashboard-alpha',
  templateUrl: './alpha.component.html',
  styleUrls: ['./alpha.component.scss'],
})
export class DashboardAlphaComponent implements OnInit {
  totalClaims: number
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
  items: Array<any>
  constructor(public firebaseService: ClaimsService) {
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
  ngOnInit() {
    this.firebaseService.getClaims().subscribe(result => {
      this.items = result
      this.items.map(item => console.log(item.payload.val()))
      this.totalClaims = this.items.length
    })
  }
}

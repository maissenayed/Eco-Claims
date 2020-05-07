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
  monthChartData = data.monthChartData
  monthChartOptions = {
    seriesBarDistance: 20,

    horizontalBars: true,
    plugins: [
      ChartistTooltip({
        appendToBody: true,
      }),
    ],
  }
  items: Array<any>
  constructor(public firebaseService: ClaimsService) {}
  ngOnInit() {
    this.firebaseService.getClaims().subscribe(result => {
      this.items = result
      this.items.map(item => console.log(item.payload.val()))
      this.totalClaims = this.items.length
    })
  }
}

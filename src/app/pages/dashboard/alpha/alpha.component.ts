import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import { ClaimsService } from 'src/app/services/firebaseServices/claims.service'
import { ChartEvent, ChartType } from 'ng-chartist'
import * as moment from 'moment'
import { IBarChartOptions, IChartistAnimationOptions, IChartistData } from 'chartist'
import { claimByMonthType } from './type'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
@Component({
  selector: 'app-dashboard-alpha',
  templateUrl: './alpha.component.html',
  styleUrls: ['./alpha.component.scss'],
})
export class DashboardAlphaComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject()
  type: ChartType = 'Bar'
  totalClaims: number
  labels: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  claimMonth: claimByMonthType = []
  monthChartData: IChartistData
  monthChartOptions: IBarChartOptions = {
    seriesBarDistance: 100,
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
    this.firebaseService
      .getClaims()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(claims => {
        this.items = claims
        this.labels.forEach(e => this.claimMonth.push({ meta: e, value: 0 }))
        this.items.map(item => {
          this.claimMonth[moment.unix(item.payload.val().id).month()].value += 1
        })
        this.monthChartData = { labels: this.labels, series: [this.claimMonth] }
        this.totalClaims = this.items.length
      })
  }

  ngOnDestroy() {
    this.destroyed$.next()
    this.destroyed$.complete()
  }
}

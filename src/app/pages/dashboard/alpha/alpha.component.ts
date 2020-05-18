import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import { ClaimsService } from 'src/app/services/firebaseServices/claims.service'
import { ChartEvent, ChartType } from 'ng-chartist'
import * as moment from 'moment'
import { IBarChartOptions, IChartistData } from 'chartist'
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
  claims: Array<any>
  constructor(public firebaseService: ClaimsService) {}
  ngOnInit() {
    this.firebaseService
      .getClaims()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(claims => {
        this.claims = claims
        this.claims = this.claims.reduce((currentArry, elementOfTheArry, Index) => {
          currentArry.push(elementOfTheArry.payload.val())
          return currentArry // *********  Important ******
        }, [])
        this.labels.forEach(e => this.claimMonth.push({ meta: e, value: 0 }))
        this.claims.map(item => {
          this.claimMonth[moment.unix(item.id).month()].value += 1
        })
        this.monthChartData = { labels: this.labels, series: [this.claimMonth] }
        this.totalClaims = this.claims.length
      })
  }
  onChange = (result: Date[]) => {
    this.claimMonth = []
    this.firebaseService
      .getClaims()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(claims => {
        this.claims = claims
        this.claims = this.claims.reduce((currentArry, elementOfTheArry, Index) => {
          currentArry.push(elementOfTheArry.payload.val())
          return currentArry // *********  Important ******
        }, [])
        this.labels.forEach(e => this.claimMonth.push({ meta: e, value: 0 }))
        this.claims = this.claims.filter(
          (claim: any) =>
            moment.unix(claim.id).format() >= moment(result[0]).format() &&
            moment.unix(claim.id).format() <= moment(result[1]).format(),
        )
        if (this.claims.length > 0)
          this.claims.map(item => {
            this.claimMonth[moment.unix(item.id).month()].value += 1
          })

        this.monthChartData = { labels: this.labels, series: [this.claimMonth] }
        this.totalClaims = this.claims.length
      })
  }
  ngOnDestroy() {
    this.destroyed$.next()
    this.destroyed$.complete()
  }

  getClaims = () => {}
}

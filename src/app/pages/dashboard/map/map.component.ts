import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core'
import * as L from 'leaflet'
import { AngularFireStorage } from '@angular/fire/storage'
import { ShapeService } from 'src/app/services/shape.service'
import { PopUpService } from 'src/app/services/pop-up.service'
import { ClaimsService } from 'src/app/services/firebaseServices/claims.service'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import { switchMap, map } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore'
import { Claim } from '../claim.model'
import {
  IBarChartOptions,
  IChartistAnimationOptions,
  IPieChartOptions,
  IChartistData,
} from 'chartist'

import { claimByMonthType, claimByStatusType } from '../alpha/type'
import * as moment from 'moment'
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts'

export type ChartOptions = {
  series: ApexAxisChartSeries
  chart: ApexChart
  xaxis: ApexXAxis
  title: ApexTitleSubtitle
}
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild('chart', { static: false }) chart: ChartComponent
  @Input() claims: Array<any>
  public chartOptions = {
    series: [0],
    labels: ['pending', 'Fixed'],
    chart: {
      height: 400,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        dataLabels: {
          name: {
            show: true,
          },
          value: {
            show: true,
            fontSize: '14px',
            fontFamily: undefined,
            color: undefined,
            formatter: function(val) {
              return val + '%'
            },
          },
        },
      },
    },
  }
  totalClaims: number
  totalStatClaims: number
  stateClaims: Array<Claim> = []
  childrenVisible = false
  monthChartLabels: string[] = [
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

  private map
  private mauritaniaShape
  private icon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 0],
      // specify the path here
      iconUrl: 'assets/images/eco-claim-logo.png',
      shadowUrl: 'assets/images/marker-shadow.png',
    }),
  }
  private PendingIcon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 0],
      // specify the path here
      iconUrl: 'assets/images/redlogo.png',
      shadowUrl: 'assets/images/marker-shadow.png',
    }),
  }
  constructor(
    private shapeService: ShapeService,
    private popupService: PopUpService,
    public claimService: ClaimsService,
    public afs: AngularFirestore,
  ) {}
  private destroyed$ = new Subject()
  public imgSrc: any // Change imgSrc type

  ngOnInit() {
    this.shapeService.getShapes().subscribe(shapes => {
      this.initMap()
      //reduce firebase paylod to just the objects
      console.log(this.claims, 'claims')
      this.totalClaims = this.claims.length
      this.mauritaniaShape = shapes
      this.initStatesLayer()

      this.claims.map(item => {
        item.status
          ? L.marker([item.latitude, item.longitude], this.icon)
              .on('click', this.markerOnClick)
              .addTo(this.map)
          : L.marker([item.latitude, item.longitude], this.PendingIcon)
              .on('click', this.markerOnClick)
              .addTo(this.map)
      })
    })
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [21.0078589, -10.951734],
      zoom: 5,
      scrollWheelZoom: false,
    })
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    })

    tiles.addTo(this.map)
  }
  private initStatesLayer = () => {
    const stateLayer = L.geoJSON(this.mauritaniaShape, {
      style: feature => ({
        weight: 0,
        opacity: 0.5,
        color: '#142850',
        fillOpacity: 0.0,
        fillColor: '#27496d',
      }),
      onEachFeature: (feature, layer) =>
        layer
          .on({
            mouseover: e => this.highlightFeature(e),
            mouseout: e => this.resetFeature(e),
            click: e => this.layerOnClick(e),
          })
          .bindPopup(
            e => {
              console.log(this.claims)
              //reset state arrays
              this.stateClaims = []
              this.monthChartData = []
              let pending = 0
              let complete = 0
              let claimMonth: claimByMonthType = []
              let popUpClaims = []
              this.monthChartLabels.forEach(e => claimMonth.push({ meta: e, value: 0 }))

              this.claims.map(item => {
                if (item.state === e.feature.properties.State) {
                  claimMonth[moment.unix(item.id).month()].value += 1
                  if (!item.status) pending += 1
                  if (item.status) complete += 1

                  const popUpClaim = {
                    date: item.date,
                    id: moment.unix(item.id).format('L'),
                    latitude: item.latitude,
                    longitude: item.longitude,
                    picture: item.picture,
                    state: item.state,
                    status: item.status,
                    tags: item.tags,
                  }
                  popUpClaims.push(popUpClaim)
                }
              })
              const posts = this.claims.map(async item => {
                if (item.state === e.feature.properties.State) {
                  item.picture = await this.getClaimImage(item.picture)
                  this.stateClaims.push(item)
                }
              })

              Promise.all(posts).then(() => {
                this.monthChartData = { labels: this.monthChartLabels, series: [claimMonth] }
                this.totalStatClaims = this.stateClaims.length
                this.chartOptions.series = [this.valueToPercent(pending, pending + complete)]

                this.openStateStat()
              })
              return this.popupService.makeCapitalPopup(e.feature.properties, popUpClaims)
            },
            { maxWidth: '500', minWidth: '200' },
          ),
    })

    this.map.addLayer(stateLayer)
  }
  private highlightFeature(e) {
    const layer = e.target
    layer.setStyle({
      weight: 5,
      opacity: 0.7,
      color: '#0c7b93',
      fillOpacity: 0.8,
      fillColor: '#00a8cc',
    })
  }

  private resetFeature(e) {
    const layer = e.target
    layer.setStyle({
      weight: 0,
      opacity: 0.5,
      color: '#142850',
      fillOpacity: 0.0,
      fillColor: '#27496d',
    })
  }
  visible = false

  private markerOnClick = e => {
    let latLngs = [e.target.getLatLng()]
    let markerBounds = L.latLngBounds(latLngs)
    this.map.fitBounds(markerBounds)
  }
  private layerOnClick = e => {
    const layer = e.target
    layer.setStyle({
      weight: 0,
      opacity: 0,
      color: '#27496d',
      fillOpacity: 0,
      fillColor: '#27496d',
    })
    let layerbound = layer.getBounds()

    this.map.fitBounds(layerbound)
  }

  valueToPercent = (value: number, total: number) => {
    if (total > 0) return (value * 100) / total
    return 0
  }

  //Model functions

  private openStateStat(): void {
    this.visible = true
  }

  private closeStateStat(): void {
    this.visible = false
  }
  private openClaimStat(): void {
    this.childrenVisible = true
  }

  private closeClaimStat(): void {
    this.childrenVisible = false
  }
  private getClaimImage = async url => {
    return await this.afs.firestore.app
      .storage()
      .refFromURL(url)
      .getDownloadURL()
      .then(picture => {
        return picture
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  //to destroy subscriptions and prevent memory leak

  ngOnDestroy() {
    this.destroyed$.next()
    this.destroyed$.complete()
  }
}

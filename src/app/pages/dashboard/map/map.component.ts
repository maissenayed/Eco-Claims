import { Component, OnInit, AfterViewInit } from '@angular/core'
import * as L from 'leaflet'
import { AngularFireStorage } from '@angular/fire/storage'
import { ShapeService } from 'src/app/services/shape.service'
import { PopUpService } from 'src/app/services/pop-up.service'
import { ClaimsService } from 'src/app/services/firebaseServices/claims.service'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import { switchMap, map } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { AngularFireModule } from '@angular/fire'
import { AngularFirestore } from '@angular/fire/firestore'
import { Claim } from '../claim.model'
import {
  IBarChartOptions,
  IChartistAnimationOptions,
  IPieChartOptions,
  IChartistData,
} from 'chartist'
import { claimByMonthType } from '../alpha/type'
import * as moment from 'moment'
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  totalClaims: number
  totalStatClaims: number
  stateClaims: Array<Claim> = []
  stateClaimsWithImg: Array<Claim> = []
  childrenVisible = false
  simplePieData: IChartistData = {
    labels: ['Bananas', 'Apples', 'Grapes'],
    series: [
      {
        value: 20,
      },
      {
        value: 10,
      },
      {
        value: 30,
      },
    ],
  }

  simplePieOptions: IPieChartOptions = {
    donut: true,
    donutWidth: 60,
    donutSolid: true,
    startAngle: 270,
    showLabel: true,
    total: 60,
  }
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
  constructor(
    private shapeService: ShapeService,
    private popupService: PopUpService,
    public claimService: ClaimsService,
    private st: AngularFireStorage,
    public afs: AngularFirestore,
  ) {}
  private destroyed$ = new Subject()
  public imgSrc: any // Change imgSrc type
  claims: Array<any> = []
  ngOnInit() {
    this.claimService
      .getClaims()
      .pipe(
        switchMap(claims =>
          this.shapeService.getShapes().pipe(map(shapes => ({ claims, shapes }))),
        ),
      )
      .subscribe(results => {
        this.initMap()
        //reduce firebase paylod to just the objects
        this.claims = results.claims.reduce((currentArry, elementOfTheArry, Index) => {
          currentArry.push(elementOfTheArry.payload.val())
          return currentArry // *********  Important ******
        }, [])
        this.totalClaims = this.claims.length
        this.mauritaniaShape = results.shapes
        this.initStatesLayer(this.claims)

        this.claims.map(item => {
          L.marker([item.latitude, item.longitude], this.icon)
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
  private initStatesLayer = (claims: Array<any>) => {
    const stateLayer = L.geoJSON(this.mauritaniaShape, {
      style: feature => ({
        weight: 3,
        opacity: 0.5,
        color: '#142850',
        fillOpacity: 0.8,
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
              this.stateClaims = []
              this.monthChartData = []
              this.stateClaimsWithImg = []
              this.claimMonth = []
              this.labels.forEach(e => this.claimMonth.push({ meta: e, value: 0 }))
              const posts = claims.map(async item => {
                if (item.state === e.feature.properties.State) {
                  this.claimMonth[moment.unix(item.id).month()].value += 1
                  this.stateClaims.push(item)
                  await this.afs.firestore.app
                    .storage()
                    .refFromURL(item.picture)
                    .getDownloadURL()
                    .then(url => {
                      item.picture = url
                      this.stateClaimsWithImg.push(item)
                    })
                    .catch(function(error) {
                      console.log(error)
                    })
                }
              })
              this.monthChartData = { labels: this.labels, series: [this.claimMonth] }
              this.totalStatClaims = this.stateClaims.length
              this.openStateStat()
              Promise.all(posts).then(res => console.log(`We have posts: ${res}!`))
              return this.popupService.makeCapitalPopup(e.feature.properties, this.stateClaims)
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
      weight: 3,
      opacity: 0.5,
      color: '#142850',
      fillOpacity: 0.8,
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
    let layerbound = e.target.getBounds()
    this.map.fitBounds(layerbound)
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

  //to destroy subscriptions and prevent memory leak

  ngOnDestroy() {
    this.destroyed$.next()
    this.destroyed$.complete()
  }
}

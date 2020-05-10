import { Component, OnInit, AfterViewInit } from '@angular/core'
import * as L from 'leaflet'
import { ShapeService } from 'src/app/services/shape.service'
import { PopUpService } from 'src/app/services/pop-up.service'
import { ClaimsService } from 'src/app/services/firebaseServices/claims.service'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import { switchMap, map } from 'rxjs/operators'
import { Subject } from 'rxjs'
const data: any = require('./../alpha/data.json')
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  totalClaims: number
  childrenVisible = false
  chartCard = data.chartCardData
  monthChartData = data.monthChartData
  monthChartOptions = {
    seriesBarDistance: 10,
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
  ) {}
  private destroyed$ = new Subject()
  items: Array<any> = []
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
        this.items = results.claims
        this.totalClaims = this.items.length
        this.mauritaniaShape = results.shapes
        this.initStatesLayer(this.items)
        this.items.map(item => {
          L.marker([item.payload.val().latitude, item.payload.val().longitude], this.icon)
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
  private initStatesLayer = (items: Array<any>) => {
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
              this.open()
              let claims: Array<any> = []
              items.map(item => {
                if (item.payload.val().state === e.feature.properties.State) {
                  claims.push(item.payload.val())
                }
              })
              return this.popupService.makeCapitalPopup(e.feature.properties, claims)
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

  private open(): void {
    this.visible = true
  }

  private close(): void {
    this.visible = false
  }
  private openChildren(): void {
    this.childrenVisible = true
  }

  private closeChildren(): void {
    this.childrenVisible = false
  }
  private markerOnClick = e => {
    let latLngs = [e.target.getLatLng()]
    let markerBounds = L.latLngBounds(latLngs)
    this.map.fitBounds(markerBounds)
  }
  private layerOnClick = e => {
    let layerbound = e.target.getBounds()
    this.map.fitBounds(layerbound)
  }
  ngOnDestroy() {
    this.destroyed$.next()
    this.destroyed$.complete()
  }
}

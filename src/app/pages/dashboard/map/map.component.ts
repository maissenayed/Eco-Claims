import { Component, OnInit, AfterViewInit } from '@angular/core'
import * as L from 'leaflet'
import { ShapeService } from 'src/app/services/shape.service'
import { PopUpService } from 'src/app/services/pop-up.service'
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  private map
  private mauritaniaShape
  constructor(private shapeService: ShapeService, private popupService: PopUpService) {}

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.initMap()
    this.shapeService.getShapes().subscribe(shape => {
      this.mauritaniaShape = shape
      console.log(shape)
      this.initStatesLayer()
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
  private initStatesLayer() {
    
    const stateLayer = L.geoJSON(this.mauritaniaShape, {
      style: feature => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B',
      }),
      onEachFeature: (feature, layer) =>
        layer
          .on({
            mouseover: e => this.highlightFeature(e),
            mouseout: e => this.resetFeature(e),
          })
          .bindPopup(e => 
           
            this.popupService.makeCapitalPopup(e.feature.properties)
          ),
    })
    this.map.addLayer(stateLayer)
  }
  private highlightFeature(e) {
    const layer = e.target
    layer.setStyle({
      weight: 10,
      opacity: 1.0,
      color: '#DFA612',
      fillOpacity: 1.0,
      fillColor: '#FAE042',
    })
  }

  private resetFeature(e) {
    const layer = e.target
    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B',
    })
  }
}

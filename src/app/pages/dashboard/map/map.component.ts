import { Component, OnInit, AfterViewInit } from '@angular/core'
import * as L from 'leaflet'
import { ShapeService } from 'src/app/services/shape.service'
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit , AfterViewInit {
  private map;
  private mauritaniaShape;
  constructor(private shapeService: ShapeService) {}

  ngOnInit() {}
  ngAfterViewInit(): void {

    this.initMap();
    this.shapeService.getShapes().subscribe(shape => {
      this.mauritaniaShape = shape;
      this.initStatesLayer();
    });
   

  }
  private initMap(): void {
    this.map = L.map('map', {
      center: [21.0078589 ,-10.951734],
      zoom: 5,
      scrollWheelZoom: false
    })
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    })

    tiles.addTo(this.map)
  }
  private initStatesLayer() {
    const stateLayer = L.geoJSON(this.mauritaniaShape, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B'
      })
    });
    this.map.addLayer(stateLayer);
  }
}

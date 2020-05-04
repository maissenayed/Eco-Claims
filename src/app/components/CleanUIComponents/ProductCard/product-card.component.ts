import { Component, OnInit } from '@angular/core'
declare var require: any
const data: any = require('./data.json')
@Component({
  selector: 'cui-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  productCardData = data
  constructor() {}
  ngOnInit() {}
}

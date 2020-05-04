import { Component, OnInit, Input } from '@angular/core'
declare var require: any
const data: any = require('./data.json')
@Component({
  selector: 'cui-pricing-item',
  templateUrl: './pricing-item.component.html',
  styleUrls: ['./pricing-item.component.scss'],
})
export class PricingItemComponent implements OnInit {
  pricingItemData = data.pricingItemData
  @Input() extended = false
  @Input() type = ''
  constructor() {}
  ngOnInit() {}
}

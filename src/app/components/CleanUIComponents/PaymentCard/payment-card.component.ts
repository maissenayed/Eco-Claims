import { Component, OnInit, Input } from '@angular/core'
@Component({
  selector: 'cui-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss'],
})
export class PaymentCardComponent implements OnInit {
  @Input() sum: string
  @Input() icon: string
  @Input() name: string
  @Input() number: string
  @Input() type: string
  @Input() footer: string
  constructor() {}
  ngOnInit() {}
}

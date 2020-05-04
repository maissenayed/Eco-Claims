import { Component, OnInit, Input } from '@angular/core'
@Component({
  selector: 'cui-payment-account',
  templateUrl: './payment-account.component.html',
  styleUrls: ['./payment-account.component.scss'],
})
export class PaymentAccountComponent implements OnInit {
  @Input() icon: string
  @Input() number: string
  @Input() sum: string
  @Input() footer: string
  constructor() {}
  ngOnInit() {}
}

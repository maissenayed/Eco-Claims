import { Component, OnInit, Input } from '@angular/core'
@Component({
  selector: 'cui-payment-transaction',
  templateUrl: './payment-transaction.component.html',
  styleUrls: ['./payment-transaction.component.scss'],
})
export class PaymentTransactionComponent implements OnInit {
  @Input() income: boolean
  @Input() amount: string
  @Input() info: string
  @Input() footer: string
  constructor() {}
  ngOnInit() {}
}

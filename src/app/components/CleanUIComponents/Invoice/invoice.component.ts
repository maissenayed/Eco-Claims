import { Component, OnInit } from '@angular/core'
declare var require: any
const invoiceData: any = require('./data.json')
@Component({
  selector: 'cui-invoice',
  templateUrl: './invoice.component.html',
})
export class InvoiceComponent implements OnInit {
  data = invoiceData.invoiceData
  constructor() {}
  ngOnInit() {}
}

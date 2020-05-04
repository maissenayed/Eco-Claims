import { Component, OnInit, Input, TemplateRef } from '@angular/core'
@Component({
  selector: 'cui-short-item-info',
  templateUrl: './short-item-info.component.html',
  styleUrls: ['./short-item-info.component.scss'],
})
export class ShortItemInfoComponent implements OnInit {
  @Input() actionTemplate: TemplateRef<void>
  @Input() name: string
  @Input() note: string
  @Input() img: string
  @Input() size: string
  constructor() {}
  ngOnInit() {}
}

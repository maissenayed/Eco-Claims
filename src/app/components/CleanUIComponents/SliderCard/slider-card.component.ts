import { Component, OnInit, Input } from '@angular/core'
@Component({
  selector: 'cui-slider-card',
  templateUrl: './slider-card.component.html',
  styleUrls: ['./slider-card.component.scss'],
})
export class SliderCardComponent implements OnInit {
  @Input() inverse = false
  constructor() {}
  ngOnInit() {}
}

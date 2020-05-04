import { Component, Input, OnChanges } from '@angular/core'

@Component({
  selector: 'cui-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnChanges {
  @Input() src: string
  @Input() size: string
  @Input() bordered: boolean
  @Input() borderColor = '#d2d9e5'
  sizeClass: string
  borderedClass: string

  ngOnChanges() {
    this.sizeClass = 'size' + this.size
    this.borderedClass = 'bordered'
  }
}

import { Component, OnInit, Input } from '@angular/core'
@Component({
  selector: 'cui-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  @Input() type: string
  @Input() avatarUrl: string
  @Input() userName: string
  @Input() userPost: string
  constructor() {}
  ngOnInit() {}
}

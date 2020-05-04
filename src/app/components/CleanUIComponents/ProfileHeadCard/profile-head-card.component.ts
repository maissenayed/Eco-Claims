import { Component, OnInit } from '@angular/core'
declare var require: any
const data: any = require('./data.json')
@Component({
  selector: 'cui-profile-head-card',
  templateUrl: './profile-head-card.component.html',
  styleUrls: ['./profile-head-card.component.scss'],
})
export class ProfileHeadCardComponent implements OnInit {
  userData = data.user
  constructor() {}
  ngOnInit() {}
}

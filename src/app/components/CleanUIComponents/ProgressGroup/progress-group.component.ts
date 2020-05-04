import { Component, OnInit } from '@angular/core'
declare var require: any
const data: any = require('./data.json')
@Component({
  selector: 'cui-progress-group',
  templateUrl: './progress-group.component.html',
})
export class ProgressGroupComponent implements OnInit {
  groupData = data.progressGroup
  constructor() {}
  ngOnInit() {}
}

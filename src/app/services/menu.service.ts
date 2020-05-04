import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { getLeftMenuData, getTopMenuData } from './menu.service.config'

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor() {}

  getLeftMenuData(): Observable<any[]> {
    return of(getLeftMenuData)
  }

  getTopMenuData(): Observable<any[]> {
    return of(getTopMenuData)
  }
}

import { Component } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import * as SettingsActions from 'src/app/store/settings/actions'
import * as Reducers from 'src/app/store/reducers'

@Component({
  selector: 'layout-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class LayoutMainComponent {
  settings$: Observable<any>
  isLightTheme: boolean
  isMenuCollapsed: boolean
  isBorderless: boolean
  isSquaredBorders: boolean
  isFixedWidth: boolean
  isMenuShadow: boolean
  isMobileView: boolean
  isMenuTop: boolean
  isMobileMenuOpen: boolean

  coldLoad: boolean = true

  constructor(private store: Store<any>) {
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      this.isLightTheme = state.isLightTheme
      this.isMenuCollapsed = state.isMenuCollapsed
      this.isBorderless = state.isBorderless
      this.isSquaredBorders = state.isSquaredBorders
      this.isFixedWidth = state.isFixedWidth
      this.isMenuShadow = state.isMenuShadow
      this.isMobileView = state.isMobileView
      this.isMenuTop = state.isMenuTop
      this.isMobileMenuOpen = state.isMobileMenuOpen
    })
  }

  onCollapse(value: any) {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        isMenuCollapsed: value,
      }),
    )
  }

  toggleTheme() {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        isLightTheme: !this.isLightTheme,
      }),
    )
  }

  toggleCollapsed() {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        isMenuCollapsed: !this.isMenuCollapsed,
      }),
    )
  }

  toggleMobileMenu() {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        isMobileMenuOpen: !this.isMobileMenuOpen,
      }),
    )
  }
}

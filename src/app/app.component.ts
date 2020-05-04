import { Component, OnInit } from '@angular/core'
import qs from 'qs'
import { Router, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { filter, map, mergeMap } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import * as SettingsActions from 'src/app/store/settings/actions'

@Component({
  selector: 'app-root',
  template: `
    <ng-progress></ng-progress>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private store: Store<any>,
  ) {}

  ngOnInit() {
    // set page title from router data variable
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild
          }
          return route
        }),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild
          }
          return route
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data),
      )
      .subscribe(event => this.titleService.setTitle('Clean UI Angular Pro | ' + event['title']))

    // listen url query params and set them to ngrx store
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        const queryString = event.url.match(/\?(.*)/)
        if (queryString) {
          const queryParams = qs.parse(queryString[1])
          const keys = Object.keys(queryParams)
          if (keys.length) {
            keys.forEach(key => {
              this.store.dispatch(
                new SettingsActions.SetStateAction({
                  [key]: queryParams[key] === 'true',
                }),
              )
            })
          }
        }
      })

    // detecting & set mobile/tablet/desktop viewports
    const setViewPort = (isMobileView: any = false, isTabletView: any = false) => {
      this.store.dispatch(
        new SettingsActions.SetStateAction({
          isMobileView,
        }),
      )
      this.store.dispatch(
        new SettingsActions.SetStateAction({
          isTabletView,
        }),
      )
    }
    const detectViewPort = (load = false) => {
      const _isMobileView = window.innerWidth < 768
      const _isTabletView = window.innerWidth < 992
      const _isDesktopView = !_isMobileView && !_isTabletView
      const isMobileView = JSON.parse(window.localStorage.getItem('app.settings.isMobileView'))
      const isTabletView = JSON.parse(window.localStorage.getItem('app.settings.isTabletView'))
      const isDesktopView = !isMobileView && !isTabletView
      if (_isDesktopView && (_isDesktopView !== isDesktopView || load)) {
        setViewPort(false, false)
      }
      if (_isTabletView && !_isMobileView && (_isTabletView !== isTabletView || load)) {
        setViewPort(false, true)
        this.store.dispatch(
          new SettingsActions.SetStateAction({
            isMenuCollapsed: true,
          }),
        )
      }
      if (_isMobileView && (_isMobileView !== isMobileView || load)) {
        setViewPort(true, false)
      }
    }
    detectViewPort(true)
    window.addEventListener('resize', () => {
      detectViewPort()
    })
  }
}

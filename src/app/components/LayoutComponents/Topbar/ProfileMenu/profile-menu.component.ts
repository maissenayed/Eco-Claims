import { Component } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'cui-topbar-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
})
export class TopbarProfileMenuComponent {
  badgeCount: number = 7
  userName: string
  billingPlan: string
  email: string
  phone: string
  role: string

  constructor(public authService: AuthService) {
    const userInfo = JSON.parse(localStorage.getItem('user'))
    this.userName = userInfo.displayName || 'Anonymous'
    this.billingPlan = 'Professional'
    this.email = userInfo.email
    this.phone = userInfo.phoneNumber || '-'
    this.role = 'admin'
  }

  badgeCountIncrease() {
    this.badgeCount = this.badgeCount + 1
  }

  logout() {
    this.authService.SignOut()
  }
}

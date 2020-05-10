import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SharedModule } from 'src/app/shared.module'
import { DashboardRouterModule } from './dashboard-routing.module'
import { CleanUIModule } from 'src/app/components/CleanUIComponents/cleanui.module'
import { ChartistModule } from 'ng-chartist'
import { NvD3Module } from 'ng2-nvd3'

import 'd3'
import 'nvd3'

// dashboard
import { DashboardAlphaComponent } from 'src/app/pages/dashboard/alpha/alpha.component'
import { MapComponent } from './map/map.component'
import { ShapeService } from 'src/app/services/shape.service'
import { PopUpService } from 'src/app/services/pop-up.service'
import { ClaimsService } from 'src/app/services/firebaseServices/claims.service'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/storage'

const COMPONENTS = [DashboardAlphaComponent, MapComponent]

@NgModule({
  imports: [
    SharedModule,
    DashboardRouterModule,
    CleanUIModule,
    ChartistModule,
    NvD3Module,
    FormsModule,
  ],
  declarations: [...COMPONENTS],
  providers: [ShapeService, PopUpService, ClaimsService, AngularFireStorage],
})
export class DashboardModule {}

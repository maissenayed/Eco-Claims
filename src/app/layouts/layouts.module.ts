import { NgModule } from '@angular/core'
import { SharedModule } from '../shared.module'
import { LayoutModule } from '../components/LayoutComponents/layout.module'

import { LayoutLoginComponent } from './Login/login.component'
import { LayoutMainComponent } from './Main/main.component'
import { LayoutPublicComponent } from './Public/public.component'

const COMPONENTS = [LayoutLoginComponent, LayoutMainComponent, LayoutPublicComponent]

@NgModule({
  imports: [SharedModule, LayoutModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class LayoutsModule {}

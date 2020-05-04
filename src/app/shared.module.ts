import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { RouterModule } from '@angular/router'

const MODULES = [CommonModule, RouterModule, NgZorroAntdModule]

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class SharedModule {}

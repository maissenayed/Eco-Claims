import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { RouterModule } from '@angular/router'
import { MaterialModule } from './material.module'
import { ReactiveFormsModule } from '@angular/forms'

const MODULES = [CommonModule, RouterModule, NgZorroAntdModule, MaterialModule, ReactiveFormsModule]

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class SharedModule {}

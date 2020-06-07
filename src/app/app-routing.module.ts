import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from 'src/app/shared.module'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AppPreloader } from 'src/app/app-routing-loader'
import { AuthGuard } from 'src/app/components/LayoutComponents/Guard/auth.guard'

// layouts & notfound
import { LayoutLoginComponent } from 'src/app/layouts/Login/login.component'
import { LayoutMainComponent } from 'src/app/layouts/Main/main.component'
import { NotFoundComponent } from 'src/app/pages/404.component'

// user
import { LoginComponent } from 'src/app/pages/user/login/login.component'
import { ForgotComponent } from 'src/app/pages/user/forgot/forgot.component'
import { PagesRegisterComponent } from './pages/user/register/register.component'

const COMPONENTS = [LoginComponent, ForgotComponent, NotFoundComponent, PagesRegisterComponent]

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/alpha',
    pathMatch: 'full',
  },
  {
    path: 'user',
    component: LayoutLoginComponent,
    children: [
      { path: 'login', component: LoginComponent, data: { title: 'Login' } },
      { path: 'forgot', component: ForgotComponent, data: { title: 'Restore Password' } },
      {
        path: 'register',
        component: PagesRegisterComponent,
        data: { title: 'Pages Register' },
      },
    ],
  },
  {
    path: '',
    component: LayoutMainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: 'src/app/pages/dashboard/dashboard.module#DashboardModule',
      },
      { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] },
    ],
  },
]

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: AppPreloader,
    }),
    LayoutsModule,
  ],
  providers: [AppPreloader],
  declarations: [...COMPONENTS],
  exports: [RouterModule],
})
export class AppRoutingModule {}

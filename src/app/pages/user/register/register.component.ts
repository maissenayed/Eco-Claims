import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-pages-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class PagesRegisterComponent implements OnInit {
  backgroundNumber = 1
  fullScreen = false
  form: FormGroup

  constructor(private fb: FormBuilder, public authService: AuthService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['admin@mediatec.org', [Validators.required, Validators.minLength(4)]],
      password: ['test', [Validators.required]],
      confirm: ['test', [Validators.required]],
    })
  }

  get email() {
    return this.form.controls.email
  }
  get password() {
    return this.form.controls.password
  }
  get confirm() {
    return this.form.controls.password
  }

  changeScreen(): void {
    this.fullScreen = !this.fullScreen
  }
  submitForm(): void {
    this.email.markAsDirty()
    this.email.updateValueAndValidity()
    this.password.markAsDirty()
    this.password.updateValueAndValidity()
    this.confirm.markAsDirty()
    this.confirm.updateValueAndValidity()
    console.log(this.email.value, this.password.value, this.confirm.value)
    if (this.email.invalid || this.password.invalid) return
    this.authService.SignUp(this.email.value, this.password.value)
  }
}

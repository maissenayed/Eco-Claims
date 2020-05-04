import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup

  constructor(private fb: FormBuilder, public authService: AuthService) {
    this.form = fb.group({
      email: ['admin@mediatec.org', [Validators.required, Validators.minLength(4)]],
      password: ['cleanui', [Validators.required]],
    })
  }

  get email() {
    return this.form.controls.email
  }
  get password() {
    return this.form.controls.password
  }

  submitForm(): void {
    this.email.markAsDirty()
    this.email.updateValueAndValidity()
    this.password.markAsDirty()
    this.password.updateValueAndValidity()
    if (this.email.invalid || this.password.invalid) return
    this.authService.SignIn(this.email.value, this.password.value)
  }
}

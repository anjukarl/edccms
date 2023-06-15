import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  failedLogin = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((value) => {
      this.failedLogin = !value;
    });
  }

  login() {
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.authService.signIn(email, password);
  }

  get email() {
    return this.form.controls['email'];
  }
  get password() {
    return this.form.controls['password'];
  }
}

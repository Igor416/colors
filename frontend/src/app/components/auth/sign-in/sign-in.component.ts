import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth/auth.service';
import { Field } from '../Field';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  name: string | undefined = undefined;
  email: string | undefined = undefined;
  password: string | undefined = undefined;
  password2: string | undefined = undefined;
  remember_me: boolean = true;

  constructor(private auth: AuthService) {
    if (this.auth.isAuth()) {
      window.history.back()
    }
  }

  check() {
    this.remember_me = !this.remember_me;
  }

  setField(el: Field): void {
    switch (el.field) {
      case 'name': this.name = el.value; break;
      case 'email': this.email = el.value; break;
      case 'password': this.password = el.value; break;
      case 'password2': this.password2 = el.value; break;
    }
  }

  ngOnInit(): void { }

  sendForm(e: Event) {
    let data = {
      'name': this.name,
      'email': this.email,
      'password': this.password,
      'remember_me': this.remember_me
    };

    if (this.name && this.email && this.password && this.password2) {
      this.auth.signup(data).subscribe((resp: any) => {
        this.auth.setAuth(true, this.remember_me);
        window.location.href = (`/profile`);
      },
      err => {
        this.auth.displayErrors(err.error);
      });
    }
  }
}

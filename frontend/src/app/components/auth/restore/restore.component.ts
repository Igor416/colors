import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth/auth.service';
import { Field } from '../Field';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.css']
})
export class RestoreComponent implements OnInit {
  step: number = 1;
  email: string | undefined = undefined;
  code: string | undefined = undefined;
  password: string | undefined = undefined;
  password2: string | undefined = undefined;
  remember_me: boolean = true;

  constructor(private auth: AuthService) { }

  check() {
    this.remember_me = !this.remember_me;
  }

  setField(el: Field): void {
    switch (el.field) {
      case 'email': this.email = el.value; break;
      case 'code': this.code = el.value; break;
      case 'password': this.password = el.value; break;
      case 'password2': this.password2 = el.value; break;
    }
  }

  ngOnInit(): void {
  }

  resendCode() {
    let data = {
      'code': 'null',
      'resend': true
    };

    this.auth.restore(data).subscribe({
      next: (resp) => {
        this.step = Number(resp.step);
      },
      error: (e) => {
        this.auth.displayErrors(e.error);
      }
    });
  }

  sendForm() {
    if (this.step == 1) {
      let data = {
        'email': this.email
      };

      if (this.email) {
        this.auth.restore(data).subscribe({
          next: (resp) => {
            this.step = Number(resp.step);
          },
          error: (e) => {
            this.auth.displayErrors(e.error);
          }
        });
      }
    }
    if (this.step == 2) {
      let data = {
        'code': this.code
      };

      if (this.code) {
        this.auth.restore(data).subscribe({
          next: (resp) => {
            this.step = Number(resp.step);
          },
          error: (e) => {
            this.auth.displayErrors(e.error);
          }
        });
      }
    }
    if (this.step == 3) {
      let data = {
        'password': this.password,
        'remember_me': this.remember_me
      };

      if (this.password && this.password2) {
        this.auth.restore(data).subscribe({
          next: (resp) => {
            this.auth.setAuth(true, this.remember_me);
          window.location.href = (`/profile`);
          },
          error: (e) => {
            this.auth.displayErrors(e.error);
          }
        });
      }
    }
  }
}

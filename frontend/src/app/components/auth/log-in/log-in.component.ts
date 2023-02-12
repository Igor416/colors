import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth/auth.service';
import { Field } from '../Field';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  email: string | undefined = undefined;
  password: string | undefined = undefined;
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
      case 'email': this.email = el.value; break;
      case 'password': this.password = el.value; break;
    }
  }

  ngOnInit(): void { }

  sendForm() {
    let data = {
      'email': this.email,
      'password': this.password,
      'remember_me': this.remember_me
    };
    
    if (this.email && this.password) {
      this.auth.login(data).subscribe({
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

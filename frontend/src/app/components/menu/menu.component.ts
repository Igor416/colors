import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() route!: string;
  signedIn!: boolean;
  hrefs: Array<{
    name: string,
    link: string
  }> = [];
  isMobile: boolean;
  row!: HTMLDivElement;
  column!: HTMLDivElement;
  opened!: boolean;

  constructor(private auth: AuthService) {
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches

    let names = ['picker', 'calculator', 'trends', 'schemes', 'models']
    let links = ['picker', 'calculator', 'trends/years', 'schemes/analogous', 'models']

    names.forEach((_, i: number) => {
      this.hrefs.push({
        name: names[i],
        link: links[i]
      })
    });
  }

  ngOnInit(): void {
    this.signedIn = this.auth.isAuth();
    let menu = document.getElementById("menu_mobile")
    this.row = menu?.children[0].children[0] as HTMLDivElement;
    this.column = menu?.children[1] as HTMLDivElement;
    this.opened = false;
    this.closeMenu();
  }

  exit(): void {
    this.toggleMenu()
    this.auth.logout().subscribe({
      next: (resp) => {
        this.auth.setAuth(false)
        window.location.href = `/`;
      },
      error: (e) => {
        this.auth.displayErrors(e.error);
      }
    });
  }

  toggleMenu() {
    this.opened ? this.closeMenu() : this.openMenu()
    this.opened = !this.opened
  }

  openMenu() {
    this.column.style.height = "100%";
    this.row.style.display = "none";
    this.column.style.padding = "10vh 0";

    let el;
    for (let i = 0; i < this.column.children.length; i++) {
      el = this.column.children[i] as HTMLDivElement
      el.style.display = "flex";
    }
  }

  closeMenu() {
    this.column.style.height = "0%";
    this.row.style.display = "flex";
    this.column.style.padding = "0";

    let el;
    for (let i = 0; i < this.column.children.length; i++) {
      el = this.column.children[i] as HTMLDivElement
      el.style.display = "none";
    }
  }
}

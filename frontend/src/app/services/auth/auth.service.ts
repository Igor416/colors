import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api = '/colors_api/'
  headers = {
    withCredentials: true,
    headers: new HttpHeaders()
  }

  constructor(private http: HttpClient, private cookies: CookieService) {
    this.headers.headers = new HttpHeaders({
      'X-CSRFToken': this.cookies.get('csrftoken') as string,
      'Content-Type': 'application/json'
    })
  }

  setAuth(value: boolean, remember_me?: boolean): void {
    const expires = new Date()
    remember_me ? expires.setDate(expires.getDate() + 3) : expires.setHours(expires.getHours() + 1)
    this.cookies.set('auth', value.toString(), {'expires': expires, path: '/'})
  }

  isAuth(): boolean {
    return this.cookies.get('auth') == 'true';
  }

  displayErrors(errors: Array<any>): void {
    console.log(`Error: ${errors}`)
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'login/', this.encrypt(data), this.headers)
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'register/', this.encrypt(data), this.headers)
  }

  restore(data: any) {
    return this.http.post<any>(this.api + 'restore/', this.encrypt(data), this.headers)
  }

  get(): Observable<any> {
    return this.http.get<any>(this.api + 'user/', this.headers)
  }

  edit(data: any): Observable<any> {
    return this.http.put<any>(this.api + 'user/', data, this.headers)
  }

  logout(): Observable<any> {
    this.setAuth(false)
    return this.http.post<any>(this.api + 'logout/', this.headers)
  }

  encrypt(data: any): any {
    if ('password' in data) {
      let password = data.password;
      data.password = this.rot13(password) // "very" secure
    }
    return data;
  }

  private rot13(str: string) {
    var input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
    var output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm456789123';
    var index = (x: string) => input.indexOf(x);
    var translate = (x: string) => index(x) > -1 ? output[index(x)] : x;
    return str.split('').map(translate).join('');
  }
}
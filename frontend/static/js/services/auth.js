class AuthService {
  constructor() {
    this.api = '/colors_api/'
    this.cookies = new CookiesService();
    this.csrftoken = this.cookies.get('csrftoken')
  }

  setAuth(value, remember_me) {
    this.cookies.set('auth', value.toString(), remember_me ? 3 : 72)
  }

  isAuth() {
    return this.cookies.get('auth') == 'true';
  }

  displayError(error) {
    console.log(error)
  }

  login(data) {
    return this.post('login/', data)
  }

  signup(data) {
    return this.post('register/', data)
  }

  logout() {
    return this.post('logout/')
  }

  async post(url, body) {
    let options = {
      method: "POST",
      mode: 'cors',
      headers: {
        'X-CSRFToken': this.csrftoken,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(this.encrypt(body))
    }
    const response = await fetch(this.api + url, options);
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(data);
  }

  encrypt(data) {
    if (!data) {
      return data;
    }
    if ('password' in data) {
      let password = data.password;
      data.password = this.rot13(password) // "very" secure
    }
    return data;
  }

  rot13(str) {
    const input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
    const output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm456789123';
    return str.split('').map(char => input.indexOf(char) > -1 ? output[input.indexOf(char)] : char).join('');
  }
}
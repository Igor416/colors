class CookiesService {
  constructor() { }
  set(key, value, exhours = 24) {
    const d = new Date();
    d.setTime(d.getTime() + (exhours * 60 * 60 * 1000));
    document.cookie = `${key}=${value};expires=${d.toUTCString()};path=/`;
  }
  
  get(key) {
    let name = key + "=";
    let cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
      let c = cookies[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
}

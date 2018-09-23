import * as jwt from "jsonwebtoken";
import * as moment from "moment";

class AuthService {
  tokenKey = "auth_token";

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  decode(token) {
    return jwt.decode(token);
  }

  getExpiration(token) {
    const exp = this.decode(token).exp;

    return moment.unix(exp);
  }

  saveToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  isValidToken(token) {
    return moment().isBefore(this.getExpiration(token));
  }

  invalidUser() {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated() {
    const token = this.getToken();

    console.log("class file", token && this.isValid ? true : false);
    return token && this.isValidToken ? true : false;
  }
}

export default new AuthService();

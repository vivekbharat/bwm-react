import * as jwt from "jsonwebtoken";
import * as moment from "moment";

class AuthService {
  tokenKey = "auth_token";

  getToken() {
    // console.log(this.tokenKey);
    return localStorage.getItem(this.tokenKey);
  }

  decode(token) {
    //4
    // console.log(token, "Classs");
    return jwt.decode(token);
  }

  saveToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  invalidUser() {
    localStorage.removeItem(this.tokenKey);
  }

  getExpiration(token) {
    //3
    const exp = this.decode(token).exp;

    return moment.unix(exp);
  }

  getUserName() {
    // console.log("IT RAN!!!!!!!!!!!!!");
    // console.log(this.decode(this.getToken()), this.getUserName);
    return this.decode(this.getToken()).userId;
  }

  isValidToken(token) {
    //2
    return moment().isBefore(this.getExpiration(token));
  }

  isAuthenticated() {
    // 1
    const token = this.getToken();

    // console.log("class file", token && this.isValid ? true : false);
    return token && this.isValidToken ? true : false;
  }
}

export default new AuthService();

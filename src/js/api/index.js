//src/js/api/index.js
/** 
 * API class for handling API requests
 *
 * This class includes methods for authentication, auction listings, and profiles.
 * It also includes error handling, logging, and storage of user data in local storage.
 **/

import {
  API_AUTH_LOGIN,
  API_AUTH_REGISTER,
  API_AUCTION_LISTINGS_SEARCH,
} from './constants.js';
import { headers } from './headers.js';

export class NoroffAPI {
  constructor() {
    this.auth.login = this.auth.login.bind(this);
    this.auth.register = this.auth.register.bind(this);
  }

  get user() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  set user(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }

  get token() {
    return localStorage.getItem('token') || null;
  }

  set token(accessToken) {
    localStorage.setItem('token', accessToken);
  }

  auth = {
    login: async function ({ email, password }) {
      const body = JSON.stringify({ email, password });

      const response = await fetch(API_AUTH_LOGIN, {
        method: 'POST',
        headers: headers(true),
        body,
      });

      if (response.ok) {
        const { data } = await response.json();
        const { accessToken: token, ...user } = data;

        this.user = user;
        this.token = token;

        return { user, token };
      }

      const errorData = await response.json();
      throw new Error(errorData.message || "Couldn't login");
    }.bind(this),

    register: async function ({ name, email, password }) {
      const body = JSON.stringify({ name, email, password });

      const response = await fetch(API_AUTH_REGISTER, {
        method: 'POST',
        headers: headers(true),
        body,
      });

      if (response.ok) {
        const { data } = await response.json();
        const { accessToken: token, ...user } = data;

        localStorage.token = token;
        localStorage.user = JSON.stringify(user);

        return { user, token };
      }

      const errorData = await response.json();
      throw new Error(errorData.message || "Couldn't register");
    }.bind(this),
  };

  search = {
    listings: async (query) => {
      const url = new URL(`${API_AUCTION_LISTINGS_SEARCH}?q=${query}`);
      const response = await fetch(url, { headers: headers() });

      if (response.ok) {
        const { data } = await response.json();
        return data;
      }

      throw new Error("Couldn't search listings");
    },
  };
}

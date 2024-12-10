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
  API_AUCTION_LISTINGS_SEARCH
} from './constants.js'; // Import API URLs from constants.js
import { headers } from './headers.js'; // Import headers function from headers.js

export class NoroffAPI {
  constructor() {
    // Bind auth methods to the class instance
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

  // Authentication methods
  auth = {
    login: async function ({ email, password }) {
      const body = JSON.stringify({ email, password });

      const response = await fetch(API_AUTH_LOGIN, {
        method: 'POST',
        headers: headers(true), // Use the headers function to set the API key
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
        headers: headers(true), // Ensure headers include Content-Type: application/json
        body,
      });

      if (response.ok) {
        const { data } = await response.json();
        const { accessToken: token, ...user } = data;
        localStorage.token = token;
        localStorage.user = JSON.stringify(user);
        return { user, token }; // Return the correctly formatted data
      }

      const errorData = await response.json();
      throw new Error(errorData.message || "Couldn't register");
    }.bind(this), // Ensure register function is bound to the class instance
  };

 // Search and sort through listings methods
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


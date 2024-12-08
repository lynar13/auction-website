/*
 * API class for handling API requests
 *
 * This class includes methods for authentication, auction listings, and profiles.
 * It also includes error handling, logging, and storage of user data in local storage.
 */

import {
  API_AUTH_LOGIN,
  API_AUTH_REGISTER,
  API_AUCTION_LISTINGS,
  API_AUCTION_LISTINGS_ID,
  API_AUCTION_PROFILES_NAME,
  API_AUCTION_LISTINGS_TAG,
  API_AUCTION_PROFILES_BIDS,
  API_AUCTION_PROFILES_LISTINGS,
  API_AUCTION_PROFILES_WINNING_LISTINGS,
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
      return JSON.parse(localStorage.user);
    } catch {
      return null;
    }
  }

  set user(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }

  get token() {
    return localStorage.token;
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

  // Listing-related methods
  listing = {
    create: async function ({ title, description, tags, media, endsAt }) {
      const body = JSON.stringify({ title, description, tags, media, endsAt });

      const response = await fetch(API_AUCTION_LISTINGS, {
        method: 'POST',
        headers: headers(true),
        body,
      });

      if (response.ok) {
        const { data } = await response.json();
        return data;
      }

      throw new Error("Couldn't create listing");
    }.bind(this),

    read: async function (id) {
      const url = API_AUCTION_LISTINGS_ID(id); // Invoke the function with `id`

      const response = await fetch(url, {
        method: 'GET',
        headers: headers(),
      });

      if (response.ok) {
        const { data } = await response.json();
        return data;
      }

      throw new Error("Couldn't read listing");
    },

    update: async function (id, { title, description, tags, media, endsAt }) {
      const url = API_AUCTION_LISTINGS_ID(id); // Invoke the function with `id`
      const body = JSON.stringify({ title, description, tags, media, endsAt });

      const response = await fetch(url, {
        method: 'PUT',
        headers: headers(),
        body,
      });

      if (response.ok) {
        const { data } = await response.json();
        return data;
      }

      throw new Error("Couldn't update listing");
    },

    delete: async function (id) {
      const url = API_AUCTION_LISTINGS_ID(id); // Invoke the function with `id`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers(),
      });

      if (response.ok) {
        return true;
      }

      throw new Error("Couldn't delete listing");
    },
  };

  // Profiles handling
  profiles = {
    read: async (username) => {
      const url = API_AUCTION_PROFILES_NAME(username); // Invoke the function with `username`

      const response = await fetch(url, {
        headers: headers(),
      });

      if (response.ok) {
        const { data } = await response.json();
        return data;
      }

      throw new Error("Couldn't read profile");
    },
  };

  // Add new methods for profiles listings, bids, winning listings, and search
  profilesListings = {
    read: async (username) => {
      const url = new URL(`${API_AUCTION_PROFILES_LISTINGS.replace('<name>', username)}`);
      const response = await fetch(url, { headers: headers() });

      if (response.ok) {
        const { data } = await response.json();
        return data;
      }

      throw new Error("Couldn't read user's listings");
    },
  };

  profilesBids = {
    read: async (username) => {
      const url = new URL(`${API_AUCTION_PROFILES_BIDS.replace('<name>', username)}`);
      const response = await fetch(url, { headers: headers() });

      if (response.ok) {
        const { data } = await response.json();
        return data;
      }

      throw new Error("Couldn't read user's bids");
    },
  };

  profilesWinningListings = {
    read: async (username) => {
      const url = new URL(`${API_AUCTION_PROFILES_WINNING_LISTINGS.replace('<name>', username)}`);
      const response = await fetch(url, { headers: headers() });

      if (response.ok) {
        const { data } = await response.json();
        return data;
      }

      throw new Error("Couldn't read user's winning listings");
    },
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

  // Tag-based listings
  listingsTag = {
    read: async (tag) => {
      const url = API_AUCTION_LISTINGS_TAG(tag); // Invoke the function with `tag`

      const response = await fetch(url, {
        headers: headers(),
      });

      if (response.ok) {
        const { data } = await response.json();
        return data;
      }

      throw new Error("Couldn't read listings with tag");
    },
  };
}


// src/js/api/auth.js
/*
 * Auth API functions
 *
 * These functions handle user login and registration using the provided API endpoints.
 * They include error handling, logging, and storage of user data in local storage.
 */
import { API_AUTH_LOGIN, API_AUTH_REGISTER } from './constants.js';
import { headers } from './headers.js';

// Function for user login
export async function login(data) {
  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: 'POST',
      headers: headers(true, false), // Use headers with Content-Type but without Authorization
      body: JSON.stringify(data),
    });

    // Log the response for debugging
    console.log('Login Response:', response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const responseData = await response.json();
    console.log('Response Data:', responseData);

    // Check if the expected fields are present
    const { accessToken, ...user } = responseData.data || responseData;  // Adjust to get accessToken correctly

    if (!user || !accessToken) {
      throw new Error('Invalid user data received from server during login');
    }

    // Store user and token in local storage correctly
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', accessToken);

    console.log('User data stored successfully after login:', { user, accessToken });

    return { user, accessToken };
  } catch (error) {
    if (error.message.includes('Too many requests')) {
      alert('You are trying too frequently. Please wait and try again.');
    } else {
      console.error('Error logging in:', error);
      alert('Something went wrong. Please try again later.');
    }
  }
}

// Function for user registration with automatic login
export async function register(data) {
  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: 'POST',
      headers: headers(true), // Include Content-Type but exclude Authorization
      body: JSON.stringify({
        ...data,
        credits: 1000, // Add initial credits for the user
      }),
    });

    console.log('Registration Response:', response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const responseData = await response.json();
    console.log('Registration Response Data:', responseData);

    const { data: userData } = responseData;

    if (!userData || !userData.email) {
      console.error('Invalid user data structure received during registration:', responseData);
      throw new Error('Invalid user data received from server during registration');
    }

    console.log(`User registered successfully with name: ${userData.name} and email: ${userData.email}`);

    // Automatically log in the user after registration using the same credentials
    const { accessToken, ...user } = await login({ email: userData.email, password: data.password });

    // Store the returned user and token in localStorage
    localStorage.setItem('user', JSON.stringify({ ...user, credits: 1000 })); // Include credits in user data
    localStorage.setItem('token', accessToken);

    console.log('User data stored successfully after registration and login:', { user, accessToken });

    return { user, accessToken };
  } catch (error) {
    if (error.message.includes('429')) {
      alert('Too many requests. Please wait and try again.');
    } else {
      alert('Registration failed. Please try again later.');
    }
  }
}
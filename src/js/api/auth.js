// src/js/api/auth.js

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
    console.error('Error during login:', error);
    throw new Error('Login failed: ' + error.message);
  }
}

// Function for user registration with automatic login
export async function register(data) {
  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: 'POST',
      headers: headers(true), // Include Content-Type but exclude Authorization
      body: JSON.stringify(data),
    });

    // Log the response for debugging
    console.log('Registration Response:', response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const responseData = await response.json();
    console.log('Registration Response Data:', responseData);

    // Check if the response contains the expected fields
    const { data: userData } = responseData; // Use correct structure as returned by server

    if (!userData || !userData.email) {
      console.error('Invalid user data structure received during registration:', responseData);
      throw new Error('Invalid user data received from server during registration');
    }

    console.log(`User registered successfully with name: ${userData.name} and email: ${userData.email}`);

    // Automatically log in the user after registration using the same credentials
    const { accessToken, ...user } = await login({ email: userData.email, password: data.password });

    // Store the returned user and token in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', accessToken);

    console.log('User data stored successfully after registration and login:', { user, accessToken });

    return { user, accessToken };
  } catch (error) {
    console.error('Error during registration:', error.message);
    throw new Error('Registration failed: ' + error.message);
  }
}

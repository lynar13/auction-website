import { describe, it, expect } from 'vitest';
import { register, login, logout } from '../src/js/api/auth'; // Update the path as needed

describe('Authentication Tests', () => {
  it('should allow a user with a stud.noroff.no email to register', async () => {
    const userData = {
      email: 'user@stud.noroff.no',
      password: 'Password123',
    };

    const response = await register(userData);
    expect(response.success).toBe(true);
    expect(response.data.email).toBe('user@stud.noroff.no');
  });

  it('should allow a registered user to log in', async () => {
    const credentials = {
      email: 'user@stud.noroff.no',
      password: 'Password123',
    };

    const response = await login(credentials);
    expect(response.success).toBe(true);
    expect(response.token).toBeDefined();
  });

  it('should allow a registered user to log out', async () => {
    const response = await logout(); // Assuming logout does not require additional parameters
    expect(response.success).toBe(true);
  });
});

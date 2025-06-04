import { getTotalCredit } from '../profile';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock user and API response
const mockUser = { name: 'testuser' };
const mockProfile = { credits: 200 };

describe('getTotalCredit', () => {
  beforeEach(() => {
    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'user') {
        return JSON.stringify(mockUser);
      }
      return null;
    });

    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProfile),
      })
    );
  });

  it('should return total credit for a logged-in user', async () => {
    const credit = await getTotalCredit();
    expect(credit).toBe(200);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(mockUser.name),
      expect.objectContaining({
        method: 'GET',
      })
    );
  });

  it('should throw if user not found in localStorage', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    await expect(getTotalCredit()).rejects.toThrow("User not found or invalid");
  });

  it('should throw if API returns error', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      })
    );
    await expect(getTotalCredit()).rejects.toThrow('Unauthorized');
  });
});

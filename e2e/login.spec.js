test('Mocked Login API', async ({ page }) => {
    // Intercept and mock the login API
    await page.route('**/auth/login', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            accessToken: 'mocked-access-token',
            user: {
              id: 1,
              name: 'Test User',
              email: 'testuser@example.com',
            },
          },
        }),
      });
    });
  
    await page.goto('http://localhost:3000/auth/login/index.html');
  
    // Fill in the login form
      await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test@1234');
  
    // Submit the form
    await page.click('button[type="submit"]');
  
    // Assert: Verify redirection to profile
    await expect(page).toHaveURL('http://localhost:3000/profile/index.html'); // Redirects to profile/dashboard
    await expect(page.locator('text=Welcome, Test User')).toBeVisible();
  });
  
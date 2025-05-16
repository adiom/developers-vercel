import { test, expect } from '@playwright/test';

// Список маршрутов и тестовых id
const routes = [
  { path: '/projects', valid: '1', invalid: 'not-a-number', special: 'new' },
  { path: '/tasks', valid: '1', invalid: 'not-a-number', special: 'new' },
  { path: '/assessments', valid: '1', invalid: 'not-a-number', special: 'new' },
  { path: '/vulnerabilities', valid: '1', invalid: 'not-a-number', special: 'new' },
  { path: '/team', valid: '1', invalid: 'not-a-number', special: 'new' },
];

for (const route of routes) {
  test.describe(`${route.path}/[id]`, () => {
    test(`Открытие валидной страницы ${route.path}/[id]`, async ({ page }) => {
      await page.goto(`http://localhost:3000${route.path}/${route.valid}`);
      await expect(page.locator('body')).not.toContainText('Internal Server Error');
      await expect(page.locator('body')).not.toContainText('params should be awaited');
    });

    test(`Открытие невалидной страницы ${route.path}/[id]`, async ({ page }) => {
      await page.goto(`http://localhost:3000${route.path}/${route.invalid}`);
      await expect(page.locator('body')).not.toContainText('Internal Server Error');
      await expect(page.locator('body')).not.toContainText('params should be awaited');
    });

    test(`Открытие special страницы ${route.path}/[id] (например, 'new')`, async ({ page }) => {
      await page.goto(`http://localhost:3000${route.path}/${route.special}`);
      await expect(page.locator('body')).not.toContainText('Internal Server Error');
      await expect(page.locator('body')).not.toContainText('params should be awaited');
    });
  });
}

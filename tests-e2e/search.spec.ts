import { expect, test } from '@playwright/test';

test.describe('Busca do acervo', () => {
  test('retorna resultados para um termo de disciplina', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Buscar materiais...');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Matemática');
    await expect(page.locator('.pagefind-ui__drawer')).toContainText(/Matemática/i);
  });
});

import { expect, test } from '@playwright/test';

test.describe('Navegação principal do portal CGEMP', () => {
  test('acessa a home, entra em um tópico e encontra um material real', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Início \| CGEMP/);
    await expect(page.getByRole('heading', { name: /Acervo de materiais da Coordenação de Ensino Médio/i })).toBeVisible();

    const topicCard = page.getByRole('link', { name: /Formação Geral Básica/i });
    await expect(topicCard).toBeVisible();
    await topicCard.click();

    await expect(page).toHaveURL(/.*\/formacao-geral-basica\/?/);
    await expect(page.getByRole('heading', { name: 'Formação Geral Básica', level: 1 })).toBeVisible();

    const mathCard = page.locator('article').filter({ hasText: 'Matemática' });
    await expect(mathCard).toBeVisible();
    await expect(mathCard.getByRole('link', { name: /Baixar material/i })).toHaveAttribute('href', '/files/formacao-geral-basica/matematica.pdf');
  });
});

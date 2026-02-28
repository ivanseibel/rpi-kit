/**
 * Template: Teste de Rota Protegida (Requer Autenticação)
 *
 * INSTRUÇÕES:
 * 1. Copie este arquivo para tests/[feature]/[nome].spec.ts
 * 2. Verifique o seed em tests/setup/seed.ts para credenciais disponíveis
 * 3. Navegue até a página real para descobrir os textos/labels corretos
 * 4. Atualize a função login() conforme a UI atual de login
 */
import { expect, test } from "@playwright/test";

test.describe("[Rota Protegida - substitua]", () => {
  /**
   * Função helper para login.
   * IMPORTANTE: Verifique a UI de login atual e ajuste os seletores conforme necessário.
   * Consulte tests/auth/login.spec.ts para o padrão atualizado.
   */
  async function login(
    page: import("@playwright/test").Page,
    email: string,
    password: string,
  ) {
    // Navegue até a página de login
    await page.goto("/auth");

    // AJUSTE: Verifique os seletores reais da UI de login
    // Consulte tests/auth/login.spec.ts para exemplos atualizados
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Senha").fill(password);
    await page.getByRole("button", { name: "Entrar" }).click();

    // Aguarde navegação para área autenticada
    await expect(page).toHaveURL(/\/dashboard/);
  }

  test.beforeEach(async ({ page }) => {
    // Use credenciais do seed.ts
    // Verifique tests/setup/seed.ts para usuários disponíveis
    await login(page, "user@example.com", "password");
  });

  test("should display page content for authenticated user", async ({
    page,
  }) => {
    // Substitua pela rota real
    await page.goto("/rota-protegida");

    // Verifique elementos reais da página
    await expect(
      page.getByRole("heading", { name: "Título Real" }),
    ).toBeVisible();
  });

  test("should perform action successfully", async ({ page }) => {
    await page.goto("/rota-protegida");

    // Execute ação com texto real do botão
    await page.getByRole("button", { name: "Texto Real" }).click();

    // Verifique resultado real
    await expect(page.getByText("Mensagem de sucesso real")).toBeVisible();
  });
});

/**
 * Template: Teste Básico de Fluxo
 *
 * INSTRUÇÕES:
 * 1. Copie este arquivo para tests/[feature]/[nome].spec.ts
 * 2. Navegue até a página real para descobrir os textos/labels corretos
 * 3. Substitua os placeholders pelos valores reais encontrados
 * 4. Use seletores semânticos conforme resources/selector-patterns.md
 */
import { expect, test } from "@playwright/test";

test.describe("[Nome do Fluxo - substitua]", () => {
  test.beforeEach(async ({ page }) => {
    // Substitua pela rota real
    await page.goto("/rota-inicial");
  });

  test("should display initial state correctly", async ({ page }) => {
    // Verifique os elementos que aparecem na UI real
    // Use: page.getByRole(), page.getByLabel(), page.getByText()
    await expect(
      page.getByRole("heading", { name: "Título Real" }),
    ).toBeVisible();
  });

  test("should validate form fields", async ({ page }) => {
    // Encontre os labels reais na UI
    await page.getByLabel("Nome do Campo Real").fill("valor inválido");
    await page.getByLabel("Nome do Campo Real").blur();

    // Verifique a mensagem de erro real que aparece
    await expect(page.getByText("Mensagem de erro real")).toBeVisible();
  });

  test("should complete flow successfully", async ({ page }) => {
    // Preencha os campos com os labels reais
    await page.getByLabel("Campo Real").fill("valor válido");

    // Use o texto real do botão
    await page.getByRole("button", { name: "Texto do Botão Real" }).click();

    // Verifique a URL de destino real
    await expect(page).toHaveURL(/\/rota-destino-real/);
  });
});

/**
 * Helpers para Testes E2E
 *
 * IMPORTANTE: Este arquivo contém EXEMPLOS de helpers.
 * Antes de usar, verifique:
 * - tests/setup/seed.ts para credenciais atuais
 * - tests/auth/login.spec.ts para padrões de login atualizados
 *
 * Copie apenas as funções que você precisa e ajuste conforme a UI atual.
 */
import { expect, type Page } from "@playwright/test";

/**
 * Gera email único para testes de registro.
 * Evita conflitos com dados existentes.
 */
export function generateUniqueEmail(prefix = "test") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;
}

/**
 * Gera nome único para entidades (empresas, projetos, etc).
 * Evita conflitos com dados existentes.
 */
export function generateUniqueName(prefix = "Test") {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Aguarda navegação para URL que corresponde ao padrão.
 */
export async function waitForUrl(page: Page, pattern: RegExp) {
  await expect(page).toHaveURL(pattern);
}

/**
 * Verifica se elemento existe sem falhar o teste.
 * Útil para lógica condicional.
 */
export async function elementExists(
  _page: Page,
  locator: ReturnType<Page["locator"]>,
  timeout = 1000,
) {
  try {
    await locator.waitFor({ timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * EXEMPLO de função de login.
 *
 * ⚠️ ATENÇÃO: Antes de usar, verifique:
 * 1. Credenciais em tests/setup/seed.ts
 * 2. Seletores em tests/auth/login.spec.ts
 *
 * Ajuste os seletores conforme a UI atual.
 */
export async function exampleLogin(
  page: Page,
  email: string,
  password: string,
) {
  await page.goto("/auth");

  // AJUSTE ESTES SELETORES conforme a UI atual
  // Consulte tests/auth/login.spec.ts para referência
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
}

# Padrões de Seletores para Testes E2E

Este documento define a **metodologia** para escolher seletores, não seletores específicos.
Sempre derive seletores da UI atual seguindo esta ordem de prioridade.

## 🎯 Ordem de Prioridade (Playwright Recomendado)

### 1. Seletores de Role (Mais Resilientes)
Baseados na semântica do elemento, não no texto ou estrutura.

```typescript
// Botões
page.getByRole("button", { name: "Texto do Botão" })

// Links
page.getByRole("link", { name: "Texto do Link" })

// Headings
page.getByRole("heading", { name: "Título" })
page.getByRole("heading", { level: 1 })

// Inputs por label associado
page.getByRole("textbox", { name: "Nome do Campo" })

// Checkboxes
page.getByRole("checkbox", { name: "Texto do Checkbox" })
```

### 2. Label e Placeholder
Para campos de formulário quando role não é suficiente.

```typescript
// Por label (preferido para inputs)
page.getByLabel("Nome do Campo")

// Por placeholder (quando não há label visível)
page.getByPlaceholder("Texto do placeholder")
```

### 3. Texto Visível
Para elementos identificados pelo seu conteúdo textual.

```typescript
// Texto exato (evita matches parciais)
page.getByText("Texto Exato", { exact: true })

// Texto parcial (quando necessário)
page.getByText("parte do texto")
```

### 4. Test IDs (Quando Semântica Não Basta)
Para casos onde não há como identificar semanticamente.

```typescript
page.getByTestId("element-id")
```

### 5. CSS/XPath (Último Recurso)
Evitar ao máximo - são frágeis e quebram com refatorações.

```typescript
// Usar apenas quando absolutamente necessário
page.locator('button[type="submit"]')
```

---

## 🔧 Técnicas de Refinamento

### Filtrar por Propriedades

```typescript
// Excluir elementos com certas características
page.getByRole("button", { name: "Entrar" })
  .filter({ hasNot: page.locator('[type="submit"]') })

// Filtrar por texto contido
page.getByRole("button")
  .filter({ hasText: "Salvar" })
```

### Encadear Seletores

```typescript
// Dentro de um container específico
page.locator("form").getByLabel("E-mail")

// Primeiro/último de muitos
page.getByRole("button", { name: "Item" }).first()
page.getByRole("button", { name: "Item" }).last()
page.getByRole("button", { name: "Item" }).nth(2)
```

### Locator com Type (para diferenciar botões)

```typescript
// Botão submit específico
page.locator('button[type="submit"]', { hasText: "Texto" })
```

---

## 📋 Metodologia: Como Descobrir Seletores

### Passo 1: Navegue até a página no browser
```bash
pnpm test:e2e:ui
```

### Passo 2: Use o Playwright Inspector
- Clique em "Pick locator" na UI do Playwright
- Clique no elemento desejado
- O Playwright sugere o melhor seletor

### Passo 3: Valide o Seletor
```typescript
// No teste, verifique se encontra o elemento único
await expect(page.getByLabel("E-mail")).toBeVisible();
```

### Passo 4: Consulte Testes Existentes
Se já existe teste para página similar, copie o padrão usado:
```bash
# Procure por padrões de seletor nos testes existentes
grep -r "getByRole" tests/
grep -r "getByLabel" tests/
```

---

## ⚠️ Antipatterns (Evitar)

```typescript
// ❌ Classes CSS (mudam frequentemente)
page.locator(".btn-primary")
page.locator(".form-input")

// ❌ IDs gerados automaticamente
page.locator("#mui-123")

// ❌ Estrutura DOM profunda
page.locator("div > div > div > button")

// ❌ Índices sem contexto
page.locator("button").nth(3)

// ❌ Dependência de texto traduzível sem exact
page.getByText("Submit") // pode ter tradução diferente
```

---

## ✅ Padrões Recomendados

```typescript
// ✅ Role com nome (resiliente)
page.getByRole("button", { name: "Salvar" })

// ✅ Label para inputs (acessibilidade)
page.getByLabel("E-mail")

// ✅ Texto exato quando necessário
page.getByText("Bem-vindo", { exact: true })

// ✅ Combinação para desambiguação
page.getByRole("button", { name: "Entrar" })
  .filter({ hasNot: page.locator('[type="submit"]') })

// ✅ Dentro de container quando há duplicação
page.locator("form#login").getByLabel("Senha")
```

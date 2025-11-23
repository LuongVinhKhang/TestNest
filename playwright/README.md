# Playwright Commands

Inside this directory, you can run several commands:

---

### Run all end-to-end tests

```sh
pnpm exec playwright test
```

---

### Start the interactive UI mode

```sh
pnpm exec playwright test --ui
```

---

### Run tests only on Desktop Chrome

```sh
pnpm exec playwright test --project=chromium
```

---

### Run tests in a specific file

```sh
pnpm exec playwright test example
```

---

### Run tests in debug mode

```sh
pnpm exec playwright test --debug
```

---

### Auto generate tests with Codegen

```sh
pnpm exec playwright codegen
```

---

## Getting Started

We suggest that you begin by typing:

```sh
pnpm exec playwright test
```
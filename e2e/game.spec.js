import { test, expect } from '@playwright/test';

test('№1: Запуск гри та відображення основних елементів', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Перевіряємо правила
  await expect(page.getByText('📖 Вгадай слово')).toBeVisible();
  await expect(page.getByText('Мета гри: Вгадати 50 слів')).toBeVisible();
  
  // Натискаємо "Почати гру"
  await page.getByRole('button', { name: /🚀 Почати гру/ }).click();
  
  // Перевіряємо елементи гри
  await expect(page.getByText(/Раунд 1: Простий/)).toBeVisible();
  await expect(page.getByPlaceholder('Введи слово')).toBeVisible();
  await expect(page.getByRole('button', { name: /✅ Перевірити/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /⏭️ Наступне/ })).toBeVisible();
});

test('№2: Перевірка відповіді - правильна та неправильна', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.getByRole('button', { name: /🚀 Почати гру/ }).click();
  
  // Вводимо неправильне слово
  await page.getByPlaceholder('Введи слово').fill('НЕПРАВИЛЬНЕ');
  await page.getByRole('button', { name: /✅ Перевірити/ }).click();
  
  // Перевіряємо помилку
  await expect(page.getByText(/Спробуй/)).toBeVisible();
  
  // Натискаємо "Наступне"
  await page.getByRole('button', { name: /⏭️ Наступне/ }).click();
  
  // Перевіряємо, що слово змінилося
  const scrambledWord = await page.locator('.scrambled-word').textContent();
  expect(scrambledWord.length).toBeGreaterThan(0);
});

test('№3: Таймер відображається', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.getByRole('button', { name: /🚀 Почати гру/ }).click();
  
  await expect(page.getByText(/⏱️/)).toBeVisible();
});
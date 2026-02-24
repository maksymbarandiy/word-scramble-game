import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shuffleWord } from '../WordScramble';
import React from 'react';
import { render, screen } from '@testing-library/react';
import WordScramble from '../WordScramble';
import userEvent from '@testing-library/user-event';

describe('Функція перемішування літер (shuffleWord)', () => {
  it('№1: повертає слово з тих самих літер, що й оригінал', () => {
    const originalWord = 'ТЕСТ';
    const shuffled = shuffleWord(originalWord);
    expect(shuffled.split('').sort().join('')).toBe(originalWord.split('').sort().join(''));
  });

  it('№2: повертає порожній рядок, якщо вхідне слово порожнє', () => {
    const emptyWord = '';
    const result = shuffleWord(emptyWord);
    expect(result).toBe('');
  });
});

describe('Гра після запуску', () => {
  beforeEach(async () => {
    const user = userEvent.setup();
    render(<WordScramble />);
    
    // Шукаємо саме кнопку, а не текст у списку
    const startButton = screen.getByRole('button', { name: /🚀 Почати гру/i });
    await user.click(startButton);
  });

  describe('Рендер компонента WordScramble', () => {
    it('№3: відображає заголовок гри та основні елементи', () => {
      expect(screen.getByText(/Вгадай слово/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Введи слово/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /✅ Перевірити/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /⏭️ Наступне/i })).toBeInTheDocument();
    });
  });

  describe('Логіка перевірки відповіді', () => {
    it('№4: кнопка перевірки активна', () => {
      const button = screen.getByRole('button', { name: /✅ Перевірити/i });
      expect(button).toBeEnabled();
    });

    it('№5: показує повідомлення про помилку при неправильній відповіді', async () => {
      const user = userEvent.setup();
      
      const input = screen.getByPlaceholderText(/Введи слово/i);
      const button = screen.getByRole('button', { name: /✅ Перевірити/i });
      
      await user.type(input, 'НЕПРАВИЛЬНЕ');
      await user.click(button);
      
      const result = await screen.findByText(/Спробуй/i);
      expect(result).toBeInTheDocument();
    });
  });

  describe('Таймер', () => {
    it('№6: відображає таймер на екрані', () => {
      expect(screen.getByText(/⏱️/)).toBeInTheDocument();
    });
  });

  describe('Навігація', () => {
    it('№7: кнопка наступного слова активна', () => {
      const nextButton = screen.getByRole('button', { name: /⏭️ Наступне/i });
      expect(nextButton).toBeEnabled();
    });
  });
});
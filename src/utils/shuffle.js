// Функція для перемішування літер
export function shuffleWord(word) {
    if (!word || word.length === 0) return word;
    
    let letters = word.split('');
    if (letters.length <= 1) return word;
    
    let shuffled;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
        shuffled = [...letters].sort(() => Math.random() - 0.5);
        attempts++;
    } while (shuffled.join('') === word && attempts < maxAttempts);
    
    return shuffled.join('');
}
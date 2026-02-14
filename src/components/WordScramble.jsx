import { useState } from 'react';

const words = ['МОРЕ', 'ЛІТО', 'КНИГА', 'СОНЦЕ', 'ДЕРЕВО'];

function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

function WordScramble() {
    const [currentWord, setCurrentWord] = useState(words[0]);
    const [scrambled, setScrambled] = useState(shuffleWord(words[0]));
    const [userInput, setUserInput] = useState('');
    const [result, setResult] = useState('');
    const [score, setScore] = useState(0);

    const checkAnswer = () => {
        if (userInput.toUpperCase() === currentWord) {
            setResult('✅ Правильно!');
            setScore(score + 1);
        } else {
            setResult('❌ Спробуй ще!');
        }
    };

    const nextWord = () => {
        const randomIndex = Math.floor(Math.random() * words.length);
        const newWord = words[randomIndex];
        setCurrentWord(newWord);
        setScrambled(shuffleWord(newWord));
        setUserInput('');
        setResult('');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Вгадай слово</h1>
            <h2 style={{ fontSize: '48px', letterSpacing: '10px' }}>{scrambled}</h2>
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Введи слово"
                style={{ padding: '10px', fontSize: '18px' }}
            />
            <button onClick={checkAnswer} style={{ padding: '10px 20px', margin: '10px' }}>
                Перевірити
            </button>
            <button onClick={nextWord} style={{ padding: '10px 20px' }}>
                Наступне слово
            </button>
            <p style={{ fontSize: '24px', marginTop: '20px' }}>{result}</p>
            <p style={{ fontSize: '20px' }}>Рахунок: {score}</p>
        </div>
    );
}

export default WordScramble;
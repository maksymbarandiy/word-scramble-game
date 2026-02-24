import { useState, useEffect } from 'react';
import { rounds } from '../data/words';
import './WordScramble.css';

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

// Час на раунд (в секундах)
const roundTime = [15, 20, 30, 45, 60];

function WordScramble() {
    const [gameStarted, setGameStarted] = useState(false);
    const [showRules, setShowRules] = useState(true); // Спочатку показуємо правила
    const [currentRound, setCurrentRound] = useState(0);
    const [roundWords, setRoundWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [result, setResult] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [roundScore, setRoundScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(roundTime[0]);
    const [timerActive, setTimerActive] = useState(false);

    // Вибрати 10 випадкових слів з раунду
    const getRandomWords = (roundIndex) => {
        const allWords = rounds[roundIndex].words;
        // Перемішуємо і беремо перші 10
        const shuffled = [...allWords].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 10);
    };

    const startGame = () => {
        setGameStarted(true);
        setShowRules(false);
        setRoundWords(getRandomWords(0));
        setCurrentRound(0);
        setCurrentIndex(0);
        setScore(0);
        setRoundScore(0);
        setAttempts(0);
        setUserInput('');
        setResult('');
        setGameFinished(false);
        setTimeLeft(roundTime[0]);
        setTimerActive(true);
    };

    const currentWord = roundWords[currentIndex]?.word || '';
    const scrambled = shuffleWord(currentWord);

    // Таймер
    useEffect(() => {
        if (!timerActive || gameFinished || !gameStarted) return;
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Час вийшов - переходимо до наступного слова
                    clearInterval(timer);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timerActive, currentRound, currentIndex, gameFinished, gameStarted]);

    const handleTimeout = () => {
        setResult('⏰ Час вийшов!');
        setAttempts(attempts + 1);
        setTimerActive(false);
        // Автоматично переходимо до наступного слова
        setTimeout(() => {
            if (currentIndex + 1 < roundWords.length) {
                setCurrentIndex(currentIndex + 1);
                setUserInput('');
                setResult('');
                setTimeLeft(roundTime[currentRound]);
                setTimerActive(true);
            } else {
                // Раунд завершено
                if (currentRound + 1 < rounds.length) {
                    nextRound();
                } else {
                    setGameFinished(true);
                    setTimerActive(false);
                }
            }
        }, 1500);
    };

    // Перехід до наступного раунду
    const nextRound = () => {
        const nextRoundIndex = currentRound + 1;
        setCurrentRound(nextRoundIndex);
        setRoundWords(getRandomWords(nextRoundIndex));
        setCurrentIndex(0);
        setUserInput('');
        setResult('');
        setRoundScore(0);
        setTimeLeft(roundTime[nextRoundIndex]);
        setTimerActive(true);
    };

    const checkAnswer = () => {
        if (!timerActive) return;
        
        const trimmedInput = userInput.trim().toUpperCase();
        
        if (!trimmedInput) {
            setResult('❌ Введи слово!');
            return;
        }

        if (trimmedInput === currentWord) {
            setResult('✅ Правильно!');
            setScore(score + 1);
            setRoundScore(roundScore + 1);
            setTimerActive(false);
            
            // Автоматично переходимо до наступного слова
            setTimeout(() => {
                if (currentIndex + 1 < roundWords.length) {
                    setCurrentIndex(currentIndex + 1);
                    setUserInput('');
                    setResult('');
                    setTimeLeft(roundTime[currentRound]);
                    setTimerActive(true);
                } else {
                    // Раунд завершено
                    if (currentRound + 1 < rounds.length) {
                        nextRound();
                    } else {
                        setGameFinished(true);
                        setTimerActive(false);
                    }
                }
            }, 1000);
        } else {
            setResult(`❌ Спробуй ще! (Підказка: ${roundWords[currentIndex].hint})`);
            setAttempts(attempts + 1);
        }
    };

    const nextWord = () => {
        if (!timerActive) return;
        
        setTimerActive(false);
        if (currentIndex + 1 < roundWords.length) {
            setCurrentIndex(currentIndex + 1);
            setUserInput('');
            setResult('');
            setTimeLeft(roundTime[currentRound]);
            setTimerActive(true);
        } else {
            // Раунд завершено
            if (currentRound + 1 < rounds.length) {
                nextRound();
            } else {
                setGameFinished(true);
                setTimerActive(false);
            }
        }
    };

    const restartGame = () => {
        setGameStarted(false);
        setShowRules(true);
        setTimerActive(false);
    };

    if (showRules) {
        return (
            <div className="game-container">
                <div className="game-card rules-card">
                    <h1 className="game-title">📖 Вгадай слово</h1>
                    
                    <div className="rules-content">
                        <p>🎯 <strong>Мета гри:</strong> Вгадати 50 слів (по 10 у кожному раунді).</p>
                        
                        <h3>📊 Раунди та час:</h3>
                        <ul className="rules-list">
                            {rounds.map((round, index) => (
                                <li key={index}>
                                    <strong>{round.name}:</strong> {roundTime[index]} секунд на слово
                                </li>
                            ))}
                        </ul>
                        
                        <h3>⚡ Як грати:</h3>
                        <ol className="rules-list">
                            <li>Натисни "Почати гру"</li>
                            <li>Тобі показується слово з перемішаними літерами</li>
                            <li>Введи правильне слово в поле</li>
                            <li>Натисни "Перевірити" або Enter</li>
                            <li>За правильну відповідь отримуєш бал</li>
                            <li>Якщо час вийшов - слово пропускається</li>
                            <li>Після 10 слів переходиш до наступного раунду</li>
                        </ol>
                    </div>
                    
                    <button 
                        onClick={startGame} 
                        className="game-button restart-btn"
                        style={{ fontSize: '1.5em', padding: '20px 50px' }}
                    >
                        🚀 Почати гру
                    </button>
                </div>
            </div>
        );
    }

    if (gameFinished) {
        return (
            <div className="game-container">
                <div className="game-card game-over">
                    <h1 className="game-over-title">🎉 Гру завершено! 🎉</h1>
                    <div className="score-display">
                        <span className="score-number">{score}</span> / 50 слів
                    </div>
                    <p className="attempts-number">Всього спроб: {attempts}</p>
                    <p className="attempts-number">Точність: {Math.round((score / attempts) * 100)}%</p>
                    <button onClick={restartGame} className="game-button restart-btn">
                        Грати знову 🔄
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="game-container">
            <div className="game-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h1 className="game-title" style={{ margin: 0 }}>🎯 Вгадай слово</h1>
                    <button 
                        onClick={restartGame} 
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '5px 10px'
                        }}
                        title="Правила гри"
                    >
                        🏠
                    </button>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <p className="progress">
                        {rounds[currentRound].name} • {currentIndex + 1} з 10
                    </p>
                    <div className="timer" style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: timeLeft < 10 ? '#f56565' : '#48bb78',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '5px 15px',
                        borderRadius: '50px'
                    }}>
                        ⏱️ {timeLeft}с
                    </div>
                </div>
                
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    {rounds[currentRound].description}
                </p>
                
                <div className="scrambled-word">{scrambled}</div>
                
                <div className="input-group">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Введи слово"
                        className="game-input"
                        onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                        disabled={!timerActive || result.includes('⏰')}
                        autoFocus
                    />
                    
                    <button 
                        onClick={checkAnswer} 
                        className="game-button check-btn"
                        disabled={!timerActive || result.includes('⏰')}
                    >
                        ✅ Перевірити
                    </button>
                    
                    <button 
                        onClick={nextWord} 
                        className="game-button next-btn"
                        disabled={!timerActive}
                    >
                        ⏭️ Наступне
                    </button>
                </div>
                
                {result && (
                    <p className={`result ${result.includes('✅') ? 'correct' : result.includes('⏰') ? 'incorrect' : 'incorrect'}`}>
                        {result}
                    </p>
                )}
                
                {result.includes('❌') && !result.includes('Підказка') && (
                    <p className="hint-text">
                        💡 Підказка: {roundWords[currentIndex].hint}
                    </p>
                )}
                
                <div className="stats">
                    <div className="stat-item">
                        <span className="stat-icon">⭐</span>
                        <span>Загалом: {score}/50</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-icon">🎯</span>
                        <span>Раунд: {roundScore}/10</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-icon">🔄</span>
                        <span>Спроба: {attempts}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WordScramble;
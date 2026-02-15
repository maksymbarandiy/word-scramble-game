import WordScramble from './components/WordScramble';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* develop: стандартна версія гри */}
      {/* feature: основний компонент гри з логікою */}
      <WordScramble />
    </div>
  );
}

export default App;
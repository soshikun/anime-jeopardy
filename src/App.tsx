import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Board from './components/Board';
import Scoreboard from './components/Scoreboard';
import QuestionModal from './components/QuestionModal';
import PlayerModal from './components/PlayerModal';
import CreateQuestionModal from './components/CreateQuestionModal';
import type { Player, Question } from './types';
import generatedQuestions from './data/questions.json';

const Container = styled.div`
  min-height: 100vh;
  background: #0b1020;
  color: #edf2fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const TitleBar = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 8px;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.25rem;
`;

const Main = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 980px) {
    flex-direction: column;
    align-items: center;
  }
`;

const BoardWrap = styled.div`
  flex: 1 1 0;
`;

const SideWrap = styled.div`
  width: 260px;
  @media (max-width: 980px) {
    width: 100%;
  }
`;

const loadFromStorage = <T,>(key: string, defaultValue: T) => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export default function App() {
  const [players, setPlayers] = useState<Player[]>(() => loadFromStorage('players', []));

  const [questions, setQuestions] = useState<Question[]>(() => loadFromStorage('questions', []));

  const [gameStarted, setGameStarted] = useState<boolean>(() =>
    loadFromStorage('gameStarted', false),
  );

  const [selected, setSelected] = useState<Question | null>(null);
  const [setupOpen, setSetupOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [finalMode, setFinalMode] = useState(false);

  useEffect(() => saveToStorage('players', players), [players]);
  useEffect(() => saveToStorage('questions', questions), [questions]);
  useEffect(() => saveToStorage('gameStarted', gameStarted), [gameStarted]);

  const handleGenerateGame = () => {
    setQuestions(generatedQuestions);
    setGameStarted(true);
  };

  const handleResolve = () => {
    if (!selected) return;
    const updated = questions.map((q) => (q === selected ? { ...q, used: true } : q));
    setQuestions(updated);
    setSelected(null);
  };

  const handleAward = (playerIndex: number, value: number) => {
    const updated = players.map((p, i) =>
      i === playerIndex ? { ...p, score: p.score + value } : p,
    );
    setPlayers(updated);
  };

  const handleAddQuestion = (question: Question) => {
    if (editingQuestion) {
      setQuestions((prev) => prev.map((p) => (p === editingQuestion ? question : p)));
    } else {
      setQuestions((prev) => [...prev, question]);
    }
    setEditingQuestion(null);
    setCreateOpen(false);
    setFinalMode(false);
  };

  const handleDeleteQuestion = () => {
    if (!editingQuestion) return;
    setQuestions((prev) => prev.filter((q) => q !== editingQuestion));
    setEditingQuestion(null);
    setCreateOpen(false);
  };

  const handleSavePlayers = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
  };

  const handleResetGame = () => {
    setPlayers([]);
    setQuestions([]);
    setGameStarted(false);
    localStorage.removeItem('players');
    localStorage.removeItem('questions');
  };

  const isUsed = (q: Question) => !!q.used;

  const handleQuestionClick = (q: Question) => {
    if (!gameStarted) {
      setEditingQuestion(q);
      setCreateOpen(true);
    } else {
      setSelected(q);
    }
  };

  const handleScoreChange = (index: number, value: string) => {
    const num = parseInt(value, 10) || 0;
    setPlayers((prev) => prev.map((p, i) => (i === index ? { ...p, score: num } : p)));
  };

  return (
    <Container>
      <TitleBar>
        <Title>Anime Jeopardy</Title>
        <button onClick={handleResetGame}>Reset Game</button>
        <button onClick={() => setSetupOpen(true)}>Setup Players</button>
        {!gameStarted && (
          <>
            <button onClick={() => setCreateOpen(true)}>Add Question</button>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setCreateOpen(true);
                setFinalMode(true);
              }}
            >
              Create Final Jeopardy
            </button>
            <button onClick={handleGenerateGame}>Generate Game</button>
            <button onClick={() => setGameStarted(true)}>Start Game</button>
          </>
        )}
      </TitleBar>

      <Main>
        <BoardWrap>
          <Board questions={questions} onQuestionClick={handleQuestionClick} isUsed={isUsed} />
        </BoardWrap>

        <SideWrap>
          <Scoreboard players={players} onScoreChange={handleScoreChange} />
        </SideWrap>
      </Main>

      <QuestionModal
        open={!!selected}
        question={selected}
        players={players}
        onClose={() => setSelected(null)}
        onAward={handleAward}
        onResolve={handleResolve}
      />

      <PlayerModal
        open={setupOpen}
        players={players}
        onClose={() => setSetupOpen(false)}
        onSave={handleSavePlayers}
      />

      <CreateQuestionModal
        open={createOpen}
        onClose={() => {
          setEditingQuestion(null);
          setCreateOpen(false);
        }}
        onSave={handleAddQuestion}
        onDelete={handleDeleteQuestion}
        question={editingQuestion}
        isFinal={finalMode}
      />
    </Container>
  );
}

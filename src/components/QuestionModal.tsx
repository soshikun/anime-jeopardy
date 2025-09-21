import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
import type { Question, Player } from '../types';

interface QuestionModalProps {
  open: boolean;
  question: Question | null;
  players: Player[];
  onClose: () => void;
  onAward: (playerIndex: number, value: number) => void;
  onResolve: () => void;
  onEdit?: (q: Question) => void;
  gameStarted?: boolean;
}

const QuestionText = styled(Typography)`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
`;

const AnswerText = styled(Typography)`
  font-size: 1rem;
  margin-top: 1rem;
  color: black;
  font-weight: bold;
`;

export default function QuestionModal({
  open,
  question,
  players,
  onClose,
  onAward,
  onResolve,
  onEdit,
  gameStarted,
}: QuestionModalProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [wagers, setWagers] = useState<Record<number, number>>({});

  if (!question) return null;

  const getValue = (playerIndex: number): number => {
    return question.isFinal ? wagers[playerIndex] || 0 : question.value;
  };

  const handleIncorrect = () => {
    if (selectedPlayer !== null) {
      onAward(selectedPlayer, -getValue(selectedPlayer));
    }
    setSelectedPlayer(null);
  };

  const handleCorrect = () => {
    if (selectedPlayer !== null) {
      onAward(selectedPlayer, getValue(selectedPlayer));
    }
    setShowAnswer(false);
    setSelectedPlayer(null);
    setWagers({});
    onResolve();
  };

  const handleWagerChange = (playerIndex: number, value: string) => {
    setWagers((prev) => ({
      ...prev,
      [playerIndex]: parseInt(value, 10) || 0,
    }));
  };

  function resolveAssetPath(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
  }

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
      }}
      maxWidth="xl"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {question.isFinal ? question.category : `${question.category} - $${question.value}`}
        <IconButton
          onClick={() => {
            setShowAnswer(false);
            setSelectedPlayer(null);
            setWagers({});
            onClose();
          }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {question.isFinal && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Enter wagers for each player:
            </Typography>
            {players.map((p, i) => (
              <TextField
                key={i}
                label={`${p.name}'s Wager`}
                type="number"
                value={wagers[i] || ''}
                onChange={(e) => handleWagerChange(i, e.target.value)}
                fullWidth
                margin="dense"
              />
            ))}
            <hr style={{ margin: '16px 0', opacity: 0.3 }} />
          </>
        )}

        <QuestionText>{question.question}</QuestionText>
        {question.image && (
          <img
            src={resolveAssetPath(question.image)}
            alt="Question visual"
            style={{
              maxWidth: '100%',
              height: question.image.endsWith('.gif') ? 'auto' : '400px',
              marginTop: '1rem',
              borderRadius: '8px',
            }}
          />
        )}
        {question.audio && (
          <audio controls style={{ width: '100%', marginTop: '1rem' }}>
            <source src={resolveAssetPath(question.audio)} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}

        {question.answers && showAnswer ? (
          <ul style={{ marginTop: '1rem', marginBottom: 0 }}>
            {question.answers.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        ) : (
          showAnswer && <AnswerText>Answer: {question.answer}</AnswerText>
        )}
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, p: 2 }}>
        <ToggleButtonGroup
          exclusive
          value={selectedPlayer}
          onChange={(_, v) => setSelectedPlayer(v)}
          fullWidth
        >
          {players.map((p, i) => (
            <ToggleButton key={i} value={i}>
              {p.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
          {!gameStarted && onEdit && (
            <Button onClick={() => question && onEdit(question)} variant="outlined" color="primary">
              Edit
            </Button>
          )}
          <Button onClick={() => setShowAnswer(!showAnswer)} color="secondary">
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </Button>
          <Button
            onClick={() => {
              if (question?.isFinal) {
                players.forEach((_, i) => {
                  const wager = wagers[i] || 0;
                  if (wager > 0) onAward(i, -wager);
                });
              }
              setShowAnswer(false);
              setSelectedPlayer(null);
              setWagers({});
              onResolve();
            }}
          >
            Close (no one correct)
          </Button>
          <Button
            onClick={handleCorrect}
            variant="contained"
            disabled={selectedPlayer === null || (question.isFinal && !wagers[selectedPlayer])}
            color="success"
          >
            Correct (+{selectedPlayer !== null ? getValue(selectedPlayer) : ''})
          </Button>
          <Button
            onClick={handleIncorrect}
            variant="contained"
            disabled={selectedPlayer === null || (question.isFinal && !wagers[selectedPlayer])}
            color="error"
          >
            Incorrect (−{selectedPlayer !== null ? getValue(selectedPlayer) : ''})
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

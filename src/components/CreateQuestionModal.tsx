import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import type { Question } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
  onDelete?: () => void;
  question?: Question | null;
  isFinal?: boolean;
}

export default function CreateQuestionModal({
  open,
  onClose,
  onSave,
  onDelete,
  question,
  isFinal,
}: Props) {
  const [category, setCategory] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answer, setAnswer] = useState('');
  const [answersText, setAnswersText] = useState('');
  const [value, setValue] = useState(100);
  const [image, setImage] = useState('');
  const [audio, setAudio] = useState('');

  useEffect(() => {
    if (open && question) {
      setCategory(question.category || '');
      setQuestionText(question.question || '');
      setAnswer(question.answer || '');
      setAnswersText(question.answers?.join('\n') || '');
      setValue(question.value || 100);
      setImage(question.image || '');
      setAudio(question.audio ? question.audio.replace('/audio/', '') : '');
    } else if (open) {
      setCategory('');
      setQuestionText('');
      setAnswer('');
      setAnswersText('');
      setValue(100);
      setImage('');
      setAudio('');
    }
  }, [open, question]);

  const handleSave = () => {
    if (!category.trim() || !questionText.trim() || (!answer.trim() && !answersText.trim())) return;

    const answersArray = answersText
      .split('\n')
      .map((a) => a.trim())
      .filter(Boolean);

    onSave({
      category: category.trim(),
      question: questionText.trim(),
      answer: answersArray.length ? undefined : answer.trim(),
      answers: answersArray.length ? answersArray : undefined,
      value,
      used: false,
      image: image.trim() || undefined,
      audio: audio.trim() ? `/audio/${audio.trim()}` : undefined,
      isFinal: question?.isFinal ?? isFinal ?? false,
    });

    setCategory('');
    setQuestionText('');
    setAnswer('');
    setAnswersText('');
    setValue(100);
    setImage('');
    setAudio('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Question</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
        />
        <TextField
          label="Question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          label="Answer (single answer)"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          fullWidth
        />
        <TextField
          label="Multiple Answers (optional, one per line)"
          value={answersText}
          onChange={(e) => setAnswersText(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
        <TextField
          label="Value"
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          fullWidth
        />
        <TextField
          label="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          fullWidth
          placeholder="Paste Discord or other public image URL"
        />
        <TextField
          label="Audio File Name (optional)"
          value={audio}
          onChange={(e) => setAudio(e.target.value)}
          fullWidth
          placeholder="File should be in /public/audio, e.g., clip1.mp3"
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, p: 2 }}>
        {onDelete && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              if (confirm('Are you sure you want to delete this question?')) {
                onDelete();
              }
            }}
          >
            Delete
          </Button>
        )}
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import styled from 'styled-components';
import type { Player } from '../types';

interface PlayerModalProps {
  open: boolean;
  players: Player[];
  onClose: () => void;
  onSave: (players: Player[]) => void;
}

const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

const PlayerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function PlayerModal({ open, players, onClose, onSave }: PlayerModalProps) {
  const [tempPlayers, setTempPlayers] = useState<Player[]>(players);

  const handleChange = (index: number, newName: string) => {
    const updated = [...tempPlayers];
    updated[index] = { ...updated[index], name: newName };
    setTempPlayers(updated);
  };

  const addPlayer = () => {
    setTempPlayers([...tempPlayers, { name: `Player ${tempPlayers.length + 1}`, score: 0 }]);
  };

  const removePlayer = (index: number) => {
    setTempPlayers(tempPlayers.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(tempPlayers);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Players</DialogTitle>
      <DialogContent>
        <PlayerList>
          {tempPlayers.map((p, i) => (
            <PlayerRow key={i}>
              <TextField
                label={`Player ${i + 1}`}
                value={p.name}
                onChange={(e) => handleChange(i, e.target.value)}
                fullWidth
              />
              <IconButton onClick={() => removePlayer(i)} disabled={tempPlayers.length <= 1}>
                <Remove />
              </IconButton>
            </PlayerRow>
          ))}
        </PlayerList>
        <Button
          startIcon={<Add />}
          onClick={addPlayer}
          sx={{ marginTop: '12px' }}
          variant="outlined"
        >
          Add Player
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

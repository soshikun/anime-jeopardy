import styled from 'styled-components';
import type { Player } from '../types';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';

interface ScoreboardProps {
  players: Player[];
  onScoreChange: (playerIndex: number, newScore: string) => void;
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const CardStyled = styled(Card)`
  width: 100%;
  max-width: 260px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  border-radius: 10px;
`;

const PlayerRow = styled(ListItem)`
  display: flex;
  justify-content: space-between;
  padding-left: 8px;
  padding-right: 8px;
`;

export default function Scoreboard({ players, onScoreChange }: ScoreboardProps) {
  return (
    <Wrapper>
      <CardStyled elevation={3}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Scoreboard
          </Typography>

          <List>
            {players.map((p, i) => (
              <PlayerRow key={i} disableGutters>
                <ListItemText
                  primary={<Typography style={{ fontWeight: 700 }}>{p.name}</Typography>}
                />
                <TextField
                  type="number"
                  value={p.score}
                  onChange={(e) => onScoreChange(i, e.target.value)}
                  variant="standard"
                  sx={{
                    width: '100px',
                    '& input': { textAlign: 'right' },
                  }}
                />
              </PlayerRow>
            ))}
          </List>
        </CardContent>
      </CardStyled>
    </Wrapper>
  );
}

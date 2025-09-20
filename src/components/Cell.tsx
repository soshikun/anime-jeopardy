import styled from 'styled-components';
import type { Question } from '../types';

interface CellProps {
  question: Question;
  onClick: () => void;
  disabled?: boolean;
}

const CellBox = styled.button<{ $disabled?: boolean }>`
  height: 100px;
  border: none;
  border-radius: 8px;
  font-weight: 800;
  font-size: 1.25rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${(p) => (p.$disabled ? '#3a4670' : '#1976d2')};
  opacity: ${(p) => (p.$disabled ? 0.55 : 1)};
  transition:
    transform 120ms ease,
    background 120ms ease;
  &:hover {
    transform: ${(p) => (p.$disabled ? 'none' : 'translateY(-3px)')};
    background: ${(p) => (p.$disabled ? '#3a4670' : '#1565c0')};
  }
`;

export default function Cell({ question, onClick, disabled = false }: CellProps) {
  return (
    <CellBox $disabled={disabled} onClick={onClick} aria-disabled={disabled}>
      {question.value > 0 ? `$${question.value}` : '—'}
    </CellBox>
  );
}

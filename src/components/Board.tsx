import styled from 'styled-components';
import type { Question } from '../types';
import Cell from './Cell';

interface BoardProps {
  questions: Question[];
  onQuestionClick: (q: Question) => void;
  isUsed: (q: Question) => boolean;
}

const Wrapper = styled.div`
  width: 100%;
  max-width: 980px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 categories */
  gap: 12px;
`;

const CategoryHeader = styled.div`
  background: #1f2a44;
  color: #fff;
  font-weight: 700;
  text-align: center;
  padding: 12px 8px;
  border-radius: 8px;
  font-size: 1rem;
`;

const EmptyCell = styled.div`
  height: 100px;
  background: transparent;
`;

const FinalRow = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const FinalButton = styled.button`
  grid-column: 1 / -1;
  background: #6a1b9a;
  color: white;
  border: none;
  padding: 18px 28px;
  font-size: 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  &:hover {
    background: #5e1590;
  }
`;

export default function Board({ questions, onQuestionClick, isUsed }: BoardProps) {
  const final = questions.find((q) => q.isFinal);
  const regular = questions.filter((q) => !q.isFinal);

  const byCategory = regular.reduce<Record<string, Question[]>>((acc, q) => {
    acc[q.category] = acc[q.category] ?? [];
    acc[q.category].push(q);
    return acc;
  }, {});

  const categories = Object.keys(byCategory).slice(0, 5);
  categories.forEach((category) => {
    byCategory[category].sort((a, b) => a.value - b.value);
  });

  const rows = Array.from({ length: 5 });

  return (
    <Wrapper>
      <Grid>
        {categories.map((category) => (
          <CategoryHeader key={`h-${category}`}>{category}</CategoryHeader>
        ))}

        {rows.flatMap((_, rowIdx) =>
          categories.map((category) => {
            const q = byCategory[category][rowIdx];
            if (!q) return <EmptyCell key={`empty-${category}-${rowIdx}`} />;
            return (
              <Cell
                key={`${category}-${q.value}`}
                question={q}
                onClick={() => !isUsed(q) && onQuestionClick(q)}
                disabled={isUsed(q)}
              />
            );
          }),
        )}
      </Grid>

      {final && (
        <FinalRow>
          <FinalButton onClick={() => onQuestionClick(final)}>Final Jeopardy</FinalButton>
        </FinalRow>
      )}
    </Wrapper>
  );
}

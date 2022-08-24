import { ReactNode } from "react";
import styled from "styled-components";

export interface Column<T> {
  active?: boolean;
  cell: (item: T) => ReactNode;
  width?: string;
}

interface Props<T> {
  headers: Array<string>;
  columns: Array<Column<T>>;
  data: Array<T>;
}

function GridTable<T>({ headers, columns, data }: Props<T>) {
  return (
    <Grid width={columns.map((it) => it.width || "auto").join(" ")}>
      {headers.map((it, index) => (
        <HeaderCell style={{ gridColumnStart: index + 1 }}>{it}</HeaderCell>
      ))}
      {data.map((d) => {
        return columns
          .filter(({ active = true }) => active)
          .map((it, index) => {
            return (
              <div style={{ gridColumnStart: index + 1 }}>{it.cell(d)}</div>
            );
          });
      })}
    </Grid>
  );
}
export { GridTable };

const Grid = styled.div<{ width: string }>`
  display: grid;
  grid-template-columns: ${({ width }) => width};
`;

const FizzBuzzCell = ({ number }: { number: number }) => {
  let gridCell = 1;
  if (number % 3 == 0 && number % 5 == 0) {
    gridCell = 4;
  } else if (number % 5 == 0) {
    gridCell = 3;
  } else if (number % 3 == 0) {
    gridCell = 2;
  } else {
    gridCell = 1;
  }
  return <h1 style={{ gridColumnStart: gridCell }}>{number}</h1>;
};

const HeaderCell = styled.h1`
  position: sticky;
  top: 0;
  background: black;
  font-size: 10px;
  padding: 10px;
`;

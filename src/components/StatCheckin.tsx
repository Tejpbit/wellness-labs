import { default as moment, default as Moment } from "moment";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { Column, Row } from "../containers/Root";
import {
  BadMediumGoodGridInputs,
  selectLastCheckinForStat,
  StatDefinition,
  StatInputUiType,
  StatLogEntry,
} from "../store";

interface StatCheckinParams {
  statDefinition: StatDefinition;
  paramSubmitted: (statLogEntry: StatLogEntry) => void;
  checkinTimestamp: moment.Moment;
}

type GridIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const StatCheckin: React.FC<StatCheckinParams> = ({
  statDefinition,
  paramSubmitted,
  checkinTimestamp,
}) => {
  const lastCheckinForStat = useRecoilValue(
    selectLastCheckinForStat(statDefinition.name)
  );

  return (
    <Column alignItems="center" justifyContent="center">
      <h1>{statDefinition.name}</h1>
      <Row>
        {lastCheckinForStat && (
          <p>
            You last checked in {statDefinition.name}{" "}
            {`${nicelyFormattedTimeSince(
              Moment(lastCheckinForStat.timestamp)
            )} ago.`}
          </p>
        )}
      </Row>
      <StatInputSelector
        inputType={statDefinition.inputType}
        onInput={(rating) =>
          paramSubmitted({
            name: statDefinition.name,
            rating: rating,
            timestamp: checkinTimestamp.toISOString(),
          })
        }
      />
    </Column>
  );
};

export const StatInputSelector = ({
  inputType,
  onInput,
}: {
  inputType: StatInputUiType;
  onInput: (statLogEntry: number) => void;
}) => {
  const [selected, setSelected] = useState<GridIndices | undefined>(undefined);

  switch (inputType.type) {
    case "BadMediumGoodGrid":
      return (
        <>
          <BadMediumGoodGrid
            descriptions={inputType.inputs}
            selected={selected}
            onSelect={(option) => {
              setSelected(option);
              onInput(option);
            }}
          />
        </>
      );
    default:
      return <>Not supported</>;
  }
};

interface BadMediumGoodGridProps {
  descriptions: BadMediumGoodGridInputs;
  selected?: GridIndices;
  onSelect: (selected: GridIndices) => void;
}

const BadMediumGoodGrid: React.FC<BadMediumGoodGridProps> = ({
  descriptions,
  selected,
  onSelect,
}: BadMediumGoodGridProps) => {
  return (
    <Row justifyContent="center">
      <Column>
        <Cell
          backgroundColor="#800e0ec6"
          description={descriptions[0]}
          selected={selected === 0}
          onClick={() => onSelect(0)}
        />
        <Cell
          backgroundColor="#bd1616c7"
          description={descriptions[1]}
          selected={selected === 1}
          onClick={() => onSelect(1)}
        />
        <Cell
          backgroundColor="#eb2525c6"
          description={descriptions[2]}
          selected={selected === 2}
          onClick={() => onSelect(2)}
        />
      </Column>
      <Column>
        <Cell
          backgroundColor="#1f4de4c3"
          description={descriptions[3]}
          selected={selected === 3}
          onClick={() => onSelect(3)}
        />
        <Cell
          backgroundColor="#3660ebc7"
          description={descriptions[4]}
          selected={selected === 4}
          onClick={() => onSelect(4)}
        />
        <Cell
          backgroundColor="#5071dfc6"
          description={descriptions[5]}
          selected={selected === 5}
          onClick={() => onSelect(5)}
        />
      </Column>
      <Column>
        <Cell
          backgroundColor="#014d01"
          description={descriptions[6]}
          selected={selected === 6}
          onClick={() => onSelect(6)}
        />
        <Cell
          backgroundColor="#008000"
          description={descriptions[7]}
          selected={selected === 7}
          onClick={() => onSelect(7)}
        />
        <Cell
          backgroundColor="#08b908"
          description={descriptions[8]}
          selected={selected === 8}
          onClick={() => onSelect(8)}
        />
      </Column>
    </Row>
  );
};

interface CellProps {
  backgroundColor: string;
  selected?: boolean;
  description: string;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({
  selected,
  description,
  onClick,
  backgroundColor,
}) => {
  return (
    <StyledCell
      className={selected ? "selected" : ""}
      backgroundColor={backgroundColor}
      onClick={onClick}
    >
      {description}
    </StyledCell>
  );
};

const StyledCell = styled.div<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  font-size: 36px;
  border-radius: 50%;
  width: 72px;
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;

  &.selected {
    /* border: 3px solid white; */
    box-shadow: 0 0 0 2px white, 1px 1px 1px 1px white;
  }

  &:active {
    opacity: 0.8;
  }

  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  -o-user-select: none;
  -moz-user-select: none;
`;

const nicelyFormattedTimeSince = (moment: moment.Moment) => {
  const years = Moment().diff(moment, "year");
  if (years >= 1) {
    return `${years} year${years > 1 ? "s" : ""}`;
  }

  const months = Moment().diff(moment, "month");
  if (months >= 1) {
    return `${months} month${months > 1 ? "s" : ""}`;
  }

  const days = Moment().diff(moment, "day");
  if (days >= 1) {
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  const hours = Moment().diff(moment, "hour");
  if (days >= 1) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    return "less than an hour";
  }
};

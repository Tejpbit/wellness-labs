import { interpolateRgb } from "d3-interpolate";
import moment from "moment";
import * as React from "react";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { DayData, dayLogOverviewState, statDefinitionsState } from "../store";
import { Column, GridTable } from "./GridTable";

interface Props {}

export const LogOverview: React.FC<Props> = () => {
  const statDefinitions = useRecoilValue(statDefinitionsState);
  const [showWeek] = React.useState(true);
  const [showDayOfWeek] = React.useState(true);
  const headers = useMemo(() => {
    const optionalColumns: Array<string> = [];
    if (showWeek) optionalColumns.push("Week");
    if (showDayOfWeek) optionalColumns.push("Day");
    return [
      ...optionalColumns,
      "Date",
      "Wakeup",
      "Went to sleep",
      ...Object.values(statDefinitions).map((it) => it.name), // TODO why does the table header hide when scrolling down when there are too many columns?
      "Comment",
    ] as Array<string>;
  }, [statDefinitions, showWeek]);
  const dayLogs = useRecoilValue(
    dayLogOverviewState({ from: moment().subtract(7, "days"), to: moment() })
  );

  return (
    <GridTable
      headers={headers}
      columns={[
        {
          active: showWeek,
          cell: (it) => {
            if (it && it.date) {
              return (
                <ColoredCell
                  color={
                    it.date.day() == 0 || it.date.day() == 6
                      ? "darkgreen"
                      : "grey"
                  }
                >
                  {it.date.isoWeek()}
                </ColoredCell>
              );
            } else {
              return <ColoredCell color="black"></ColoredCell>;
            }
          },
        },
        {
          active: showDayOfWeek,
          cell: (it) => {
            if (it && it.date) {
              return (
                <ColoredCell
                  color={
                    it.date.day() == 0 || it.date.day() == 6
                      ? "darkgreen"
                      : "grey"
                  }
                >
                  {it.date.format("dd")}
                </ColoredCell>
              );
            } else {
              return <ColoredCell color="black"></ColoredCell>;
            }
          },
        },
        {
          cell: (it) => {
            if (it && it.date) {
              return (
                <ColoredCell
                  color={
                    it.date.day() == 0 || it.date.day() == 6
                      ? "darkgreen"
                      : "grey"
                  }
                >
                  {it.date ? moment(it.date).format("MMM DD") : ""}
                </ColoredCell>
              );
            } else {
              return <ColoredCell color="black"></ColoredCell>;
            }
          },
        },
        {
          cell: (it) => {
            return <Cell>{formatToTimeOfDay(it.wakeupTime)}</Cell>;
          },
        },
        {
          cell: (it) => {
            return <Cell>{formatToTimeOfDay(it.goToSleepTime)}</Cell>;
          },
        },
        ...Object.values(statDefinitions).map(
          (def) =>
            ({
              cell: (it) => {
                if (it.stats && it.stats[def.name]?.rating) {
                  return (
                    <StatCell rating={it.stats[def.name]?.rating}>
                      {it.stats ? it.stats[def.name]?.rating : ""}
                    </StatCell>
                  );
                } else {
                  return <Cell />;
                }
              },
            } as Column<Partial<DayData>>)
        ),
        {
          cell: (it) => {
            return <Cell>{it.comment}</Cell>;
          },
        },
      ]}
      data={Object.values(dayLogs)}
    />
  );
};

const StatCell = ({
  rating,
  children,
}: {
  rating: number;
  children: React.ReactNode;
}) => {
  const colorInterpolate = interpolateRgb("darkred", "darkgreen");
  return (
    <Cell
      style={{
        backgroundColor: colorInterpolate(rating / 8),
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Cell>
  );
};

const Cell = styled.p`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid darkgrey;
  text-align: center;
`;

const ColoredCell = styled(Cell)<{ color: string }>`
  background-color: ${({ color }) => color};
`;

export const LogOverview2: React.FC<Props> = () => {
  const statDefinitions = useRecoilValue(statDefinitionsState);
  const dayLogs = useRecoilValue(
    dayLogOverviewState({ from: moment().subtract(7, "days"), to: moment() })
  );

  return (
    <Table style={{ height: "100%" }}>
      <thead>
        <Tr>
          <Th>Date</Th>
          <Th>Wakeup</Th>
          <Th>Went to sleep</Th>
          {Object.values(statDefinitions).map((it) => (
            <Th key={it.name}>{it.name}</Th>
          ))}
          <Th>Comment</Th>
        </Tr>
      </thead>
      <TBody>
        {Object.keys(dayLogs).map((k) => (
          <Tr key={k}>
            <Td>{moment(k).format("MMM d")}</Td>
            <Td>{formatToTimeOfDay(dayLogs[k].wakeupTime)}</Td>
            <Td>{formatToTimeOfDay(dayLogs[k].goToSleepTime)}</Td>
            {Object.values(statDefinitions).map((it) => (
              <Td>
                <StatLogCell dayLog={dayLogs[k]} stat={it.name} />
              </Td>
            ))}
            <Td>{dayLogs[k].comment}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  );
};

interface StatLogCellProps {
  dayLog?: Partial<DayData>;
  stat: string;
}

const StatLogCell: React.FC<StatLogCellProps> = ({ dayLog, stat }) => {
  if (dayLog?.stats !== undefined) {
    return <>{dayLog.stats[stat]?.rating}</>;
  }
  return <></>;
};

function formatToTimeOfDay(str: moment.Moment | undefined): string | undefined {
  return str?.format("HH:mm");
}

const Td = styled.td`
  text-align: center;
`;

const Th = styled.th`
  top: 0;
  font-size: 10px;
  position: sticky;
  background-color: black;
`;

const Tr = styled.tr``;

const TBody = styled.tbody`
  overflow: scroll;
  webkitoverflowscrolling: "touch";
`;

const Table = styled.table`
  position: relative;
  border-collapse: collapse;
  text-align: left;
`;

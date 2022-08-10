import _ from "lodash";
import { default as moment, default as Moment } from "moment";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { DateAndRangeEditBar } from "../components/DateAndRangeEditBar";
import { Column, FlexBox, Row } from "../containers/Root";
import {
  statDefinitionsState,
  StatLogEntry,
  statsCheckinLogState,
} from "../store";

export const Statistics = () => {
  const statDefinitions = useRecoilValue(statDefinitionsState);
  const statCheckinLog = useRecoilValue(statsCheckinLogState);

  const [activeStats, setActiveStats] = useState(
    statDefinitions.map((it) => it.name)
  );

  const filteredStatCheckinLog = statCheckinLog.filter((it) =>
    activeStats.includes(it.name)
  );

  const toggleStat = (name: string) => {
    if (activeStats.includes(name)) {
      setActiveStats(activeStats.filter((it) => it !== name));
    } else {
      setActiveStats([...activeStats, name]);
    }
  };

  const [start1, setStart1] = useState(
    Moment().startOf("day").subtract(21, "days")
  );
  const [end1, setEnd1] = useState(Moment().endOf("day").subtract(7, "days"));
  const [start2, setStart2] = useState(
    Moment().startOf("day").subtract(7, "days")
  );
  const [end2, setEnd2] = useState(Moment().endOf("day"));

  return (
    <Column>
      <FlexBox>
        {statDefinitions.map((it) => (
          <ToggleableTag
            key={it.name}
            color={it.color}
            name={it.name}
            onClick={() => toggleStat(it.name)}
            active={activeStats.includes(it.name)}
          />
        ))}
      </FlexBox>
      <Row style={{ flex: 1, height: "200px" }}>
        <DateAndRangeEditBar
          moveRange={() => {
            setStart1(Moment(start1).subtract(1, "days"));
            setEnd1(Moment(end1).subtract(1, "days"));
          }}
          moveText="<"
          expandRange={() => {
            setStart1(Moment(start1).subtract(1, "day"));
          }}
          shrinkRange={() => {
            setStart1(Moment(start1).add(1, "day"));
          }}
        />
        <LineChartForDateRange
          statCheckinLog={filteredStatCheckinLog}
          start={start1}
          end={end1}
        />
        <DateAndRangeEditBar
          moveRange={() => {
            setStart1(Moment(start1).add(1, "day"));
            setEnd1(Moment(end1).add(1, "day"));
          }}
          moveText=">"
          expandRange={() => {
            setEnd1(Moment(end1).add(1, "day"));
          }}
          shrinkRange={() => {
            setEnd1(Moment(end1).subtract(1, "day"));
          }}
        />
      </Row>
      <Row style={{ flex: 1, height: "200px" }}>
        <DateAndRangeEditBar
          moveRange={() => {
            setStart2(Moment(start2).subtract(1, "day"));
            setEnd2(Moment(end2).subtract(1, "day"));
          }}
          moveText="<"
          expandRange={() => {
            setStart2(Moment(start2).subtract(1, "day"));
          }}
          shrinkRange={() => {
            setStart2(Moment(start2).add(1, "day"));
          }}
        />
        <LineChartForDateRange
          statCheckinLog={filteredStatCheckinLog}
          start={start2}
          end={end2}
        />
        <DateAndRangeEditBar
          moveRange={() => {
            setStart2(Moment(start2).add(1, "day"));
            setEnd2(Moment(end2).add(1, "day"));
          }}
          moveText=">"
          expandRange={() => {
            setEnd2(Moment(end2).add(1, "day"));
          }}
          shrinkRange={() => {
            setEnd2(Moment(end2).subtract(1, "day"));
          }}
        />
      </Row>
    </Column>
  );
};

interface LineChartForDateRangeProps {
  start: moment.Moment;
  end: moment.Moment;
  statCheckinLog: Array<StatLogEntry>;
}

export const LineChartForDateRange: React.FC<LineChartForDateRangeProps> = ({
  start,
  end,
  statCheckinLog,
}) => {
  const statDefinitions = useRecoilValue(statDefinitionsState);

  let formattedData = statCheckinLog.filter((it) =>
    Moment(it.timestamp).isBetween(start, end)
  );

  //normalize timestamps to whole days.
  formattedData = formattedData.map((it) => ({
    ...it,
    timestamp: Moment(it.timestamp).startOf("day").toISOString(),
  }));

  // remove duplicates for same day.
  // TODO No special care is taken here to decide which entry to use is multiple entries has been done on the same day
  formattedData = _.uniqBy(formattedData, (d) => `${d.name}${d.timestamp}`);

  // reformat to fit the recharts library format better
  const chartData = formatData(formattedData, start, end);
  //const ticks = formattedData.map((it) => it.timestamp);
  const ticks = _.range(0, end.diff(start, "days") + 1).map((i) =>
    Moment(start).add(i, "days").toISOString()
  );
  console.log("ticks", ticks);
  return (
    <ResponsiveContainer>
      <LineChart
        data={chartData}
        width={400}
        height={300}
        margin={{ top: 20, right: 75, left: 5, bottom: 5 }}
      >
        <XAxis
          dataKey="timestamp"
          ticks={ticks}
          angle={25}
          tickFormatter={formatTimeStampToReadableDate}
          textAnchor="start"
          height={50}
        />
        {/* TODO Assume range is 0 to 8 since
        BadMediumGoodGrid submits value from 0 to 8.
        But this should probably be derived from something else if input forms becomes more comples */}
        <YAxis type="number" domain={[0, 8]} />{" "}
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        {statDefinitions.map((it) => (
          <Line
            key={it.name}
            dataKey={it.name}
            type="monotone"
            stroke={it.color}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

interface ChartData {
  timestamp: string;
  dataKeys: Array<string>;
  [key: string]: number | string | Array<string>;
}

// Receives an array of StatLogEntry where but the timestamps should have been rounded to the current day
// outputs an array of ChartData where StatLogEntries with the same timestamp have been grouped into the same object
function formatData(
  data: Array<StatLogEntry>,
  start: Moment.Moment,
  end: Moment.Moment
): Array<ChartData> {
  let acc: Record<string, ChartData> = {};
  data.forEach((item) => {
    const timestamp = item.timestamp;

    if (timestamp in acc) {
      acc[timestamp] = {
        ...acc[timestamp],
        dataKeys: _.uniq([...acc[item.timestamp].dataKeys, item.name]),
        [item.name]: item.rating,
      };
    } else {
      acc[timestamp] = {
        timestamp: item.timestamp,
        dataKeys: [item.name],
        [item.name]: item.rating,
      };
    }
  });

  _.range(0, end.diff(start, "days")).forEach((i) => {
    const t = Moment(start).add(i, "days").toISOString();
    if (!(t in acc)) {
      acc[t] = { timestamp: t, dataKeys: [] };
    }
  });

  return Object.values(acc);
}

function formatTimeStampToReadableDate(timestamp: string) {
  const m = Moment(timestamp);
  return m.format("MMM Do");
}

interface ToggleableTagProps {
  color: string;
  name: string;
  onClick: () => void;
  active: boolean;
}

const ToggleableTag: React.FC<ToggleableTagProps> = ({
  color,
  name,
  onClick,
  active,
}) => {
  return (
    <StyledToggleableTag onClick={onClick} color={color} active={active}>
      {name}
    </StyledToggleableTag>
  );
};

const StyledToggleableTag = styled.div<{ color: string; active: boolean }>`
  background-color: ${({ color }) => color};
  opacity: ${({ active }) => (active ? 1 : 0.3)};
  color: black;
  padding: 5px;
  margin: 5px;

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

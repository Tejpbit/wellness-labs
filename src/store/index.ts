import _ from "lodash/fp";
import moment from "moment";
import {
  atom,
  AtomEffect,
  DefaultValue,
  selector,
  selectorFamily,
} from "recoil";

export type StatInputUiType = BadMediumGoodGrid;

export interface BadMediumGoodGrid {
  type: "BadMediumGoodGrid";
  inputs: BadMediumGoodGridInputs;
}

export type BadMediumGoodGridInputs = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

export interface StatDefinition {
  name: string;
  color: string;
  inputType: StatInputUiType;
}

export type LogEntry = StatLogEntry | SleepLogEntry;

// Think stat as in pokémon stat. An attribute that describes some performance
export interface Stat {
  name: string;
  rating: number;
}

export type LogType = "statLogEntry" | "sleepLogEntry" | "noteLogEntry";

export interface LogEntryBase {
  type: LogType;
  timestamp: string;
}

export interface StatLogEntry extends LogEntryBase {
  type: "statLogEntry";
  name: string;
  rating: number;
  note?: string;
}

export interface SleepLogEntry extends LogEntryBase {
  type: "sleepLogEntry";
  wakeOrSleep: "wake" | "sleep";
}

export interface NoteLogEntry extends LogEntryBase {
  type: "noteLogEntry";
  note: string;
}

export interface Experiment {
  title: string;
  startDate: Date;
  log: Record<DateString, ExperimentLogEntry>;
}

export interface ExperimentLogEntry {
  date: Date;
  comment: string;
}

export type DateString = string;

const localStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

// When using the useRecoilState hook to modify this state
// Make sure to clone it. Moments subtract and add function modifies the object
// which messes with react re-rendering
export const selectedDateState = atom({
  key: "selectedDateState",
  default: moment(),
});

export const logState = atom<Array<LogEntry>>({
  key: "statsCheckinLogState",
  default: [] as Array<StatLogEntry>,
  effects: [
    ({ onSet, setSelf }) => {
      onSet((newValue) => setSelf(_.sortBy((it) => it.timestamp, newValue)));
    },
    localStorageEffect("statsCheckinLogState"),
    ({ onSet }) => {
      onSet((newValue) => {
        console.log("statsLog updated", newValue);
      });
    },
  ],
});

export const selectLastCheckinForStat = selectorFamily<
  StatLogEntry | undefined,
  string
>({
  key: "selectLastCheckinForStat",
  get:
    (statName) =>
    ({ get }) => {
      const statsLog = get(logState);
      const entriesForStatName = statsLog
        .filter<StatLogEntry>(
          (it): it is StatLogEntry => it.type === "statLogEntry"
        )
        .filter((it) => it.name === statName);
      const sortedEntriesForStatName = _.sortBy(
        (it) => it.timestamp,
        entriesForStatName
      );
      return sortedEntriesForStatName[0];
    },
});

// Only use this for writing. I.e. with useSetRecoilState
export const singleStatWriter = selector<LogEntry>({
  key: "singleStatWriter",
  get: () => {
    throw Error("This selector family should only be used to write state");
  },

  set: ({ set }, logEntry) => {
    if (logEntry instanceof DefaultValue) {
      // TODO this makes it so we cannot reset the atom from this selector. Might not be right
      set(logState, (prevState) => prevState);
    } else {
      set(logState, (prevState) => [...prevState, logEntry]);
    }
  },
});

export const statLogState = selector<Array<StatLogEntry>>({
  key: "statLogState",
  get: ({ get }) =>
    get(logState).filter(
      (it): it is StatLogEntry => it.type === "statLogEntry"
    ),
});

export const sleepLogState = selector<Array<SleepLogEntry>>({
  key: "sleepLog",
  get: ({ get }) =>
    get(logState).filter(
      (it): it is SleepLogEntry => it.type === "sleepLogEntry"
    ),
});

export interface DayData {
  date: moment.Moment;
  wakeupTime: moment.Moment;
  goToSleepTime: moment.Moment;
  stats: Record<string, StatLogEntry>;
  comment: string;
}

// Partial since we don't know if the user has filled in all information
export type DayLogOverviewState = Record<string, Partial<DayData>>;

export type DateRange = {
  from: moment.Moment;
  to: moment.Moment;
};

export const dayLogOverviewState = selectorFamily<
  DayLogOverviewState,
  DateRange
>({
  key: "dayLogOverviewState",
  get:
    ({ from, to }) =>
    ({ get }) => {
      // const logsForDay = get(logState).filter((it) =>
      //   Moment(it.timestamp).isSame(date, "day")
      // );

      // const sleepLogEntries = logsForDay.filter(
      //   (it): it is SleepLogEntry => it.type === "sleepLogEntry"
      // );
      // const wakeupTime = sleepLogEntries.find(
      //   (it) => it.wakeOrSleep === "wake"
      // )?.timestamp;
      // const goToSleepTime = sleepLogEntries.find(
      //   (it) => it.wakeOrSleep === "sleep"
      // )?.timestamp;

      return generateFakeDayLogOverviewState();
    },
});

function generateFakeDayLogOverviewState(): DayLogOverviewState {
  const obj: DayLogOverviewState = {};
  const now = moment();
  _.range(0, 100).forEach((it) => {
    const fakeDayData = generateFakeDayData(moment(now).subtract(it, "days"));
    if (fakeDayData.date) obj[fakeDayData.date.toISOString()] = fakeDayData;
  });
  return obj;
}

function generateFakeDayData(day: moment.Moment): Partial<DayData> {
  const hasWakeupTime = _.random(0, 1) < 0.5 ? true : false;
  const hasGoToSleepTime = _.random(0, 1) < 0.5 ? true : false;
  const hasVärklös = _.random(0, 1) < 0.5 ? true : false;
  const hasGlädjefylld = _.random(0, 1) < 0.5 ? true : false;
  const hasEnergirik = _.random(0, 1) < 0.5 ? true : false;
  const hasAvslappnad = _.random(0, 1) < 0.5 ? true : false;
  const hasHarmonisk = _.random(0, 1) < 0.5 ? true : false;
  const hasWorkload = _.random(0, 1) < 0.5 ? true : false;
  const hasComment = _.random(0, 1) < 0.5 ? true : false;

  const obj: Partial<DayData> = {
    date: moment(day).startOf("day"),
    stats: {},
  };
  if (hasWakeupTime)
    obj.wakeupTime = moment(day)
      .startOf("day")
      .add(_.random(440, 520), "minutes");
  if (hasGoToSleepTime)
    obj.goToSleepTime = moment(day)
      .endOf("day")
      .subtract(_.random(60, 120), "minutes");

  const createLogEntry = (keyName: string): StatLogEntry => ({
    name: "keyName",
    rating: _.random(1, 9),
    timestamp: logEntryTime.toISOString(),
    type: "statLogEntry",
  });

  const logEntryTime = moment(day)
    .startOf("day")
    .add(_.random(480, 600), "minutes");
  if (hasVärklös && obj.stats) obj.stats["Värklös"] = createLogEntry("Värklös");
  if (hasGlädjefylld && obj.stats)
    obj.stats["Glädjefylld"] = createLogEntry("Glädjefylld");
  if (hasEnergirik && obj.stats)
    obj.stats["Energirik"] = createLogEntry("Energirik");
  if (hasHarmonisk && obj.stats)
    obj.stats["Harmonisk"] = createLogEntry("Harmonisk");
  if (hasAvslappnad && obj.stats)
    obj.stats["Avslappnad"] = createLogEntry("Avslappnad");
  if (hasWorkload && obj.stats)
    obj.stats["Workload"] = createLogEntry("Workload");
  if (hasComment && obj.stats) obj.comment = "Very nice string";

  return obj;
}

function extractDayDatasForDateRange(
  log: Array<LogEntry>,
  dateRange: DateRange
): DayLogOverviewState {
  const acc: DayLogOverviewState = {};

  log.forEach((it) => {
    const m = moment(it.timestamp);
    if (m.isBetween(dateRange.from, dateRange.to)) {
      acc[m.startOf("day").toISOString()] = {};
    }
  });

  return acc;
}

var colorArray = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000",
  "#B33300",
  "#CC80CC",
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF",
];

export const statDefinitionsState = atom({
  key: "statDefinitionsState",
  default: [
    {
      name: "Värklös",
      color: colorArray[0],
      inputType: {
        type: "BadMediumGoodGrid",
        inputs: ["😭", "😩", "😰", "😓", "😣", "😟", "😕", "😑", "😌"],
      },
    },
    {
      name: "Glädjefylld",
      color: colorArray[1],
      inputType: {
        type: "BadMediumGoodGrid",
        inputs: ["", "😒", "", "", "😐", "", "🙂", "😊", "😁"],
      },
    },
    {
      name: "Energirik",
      color: colorArray[2],
      inputType: {
        type: "BadMediumGoodGrid",
        inputs: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      },
    },
    {
      name: "Avslappnad",
      color: colorArray[3],
      inputType: {
        type: "BadMediumGoodGrid",
        inputs: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      },
    },
    {
      name: "Harmonisk",
      color: colorArray[4],
      inputType: {
        type: "BadMediumGoodGrid",
        inputs: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      },
    },
    {
      name: "Workload",
      color: colorArray[5],
      inputType: {
        type: "BadMediumGoodGrid",
        inputs: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      },
    },
  ] as Array<StatDefinition>,
});

import _ from "lodash";
import Moment from "moment";
import {
  atom,
  AtomEffect,
  DefaultValue,
  selector,
  selectorFamily
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

// Think stat as in pokémon stat. An attribute that describes some performance
export interface Stat {
  name: string;
  rating: number;
}

export interface StatCheckin {
  timestamp: string;
  stats: Array<Stat>;
}

export interface StatLogEntry {
  name: string;
  rating: number;
  timestamp: string;
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
  default: Moment(),
});

export const statsCheckinLogState = atom<Array<StatLogEntry>>({
  key: "statsCheckinLogState",
  default: [] as Array<StatLogEntry>,
  effects: [
    ({ onSet, setSelf }) => {
      onSet((newValue) => setSelf(_.sortBy(newValue, (it) => it.timestamp)));
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
      const statsLog = get(statsCheckinLogState);
      return _.chain(statsLog)
        .filter((it) => it.name === statName)
        .sortBy((it) => it.timestamp)
        .first()
        .value();
    },
});

// Only use this for writing. I.e. with useSetRecoilState
export const statsCheckinWriter = selector<StatCheckin>({
  key: "statsCheckinWriter",
  get: () => {
    throw Error("This selector family should only be used to write state");
  },

  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      // TODO this makes it so we cannot reset the atom from this selector. Might not be right
      set(statsCheckinLogState, (prevState) => prevState);
    } else {
      const logEntries = newValue.stats.map((it) => ({
        ...it,
        timestamp: newValue.timestamp,
      }));
      set(statsCheckinLogState, (prevState) => [...prevState, ...logEntries]);
    }
  },
});

// Only use this for writing. I.e. with useSetRecoilState
export const singleStatWriter = selector<StatLogEntry>({
  key: "singleStatWriter",
  get: () => {
    throw Error("This selector family should only be used to write state");
  },

  set: ({ set }, logEntry) => {
    if (logEntry instanceof DefaultValue) {
      // TODO this makes it so we cannot reset the atom from this selector. Might not be right
      set(statsCheckinLogState, (prevState) => prevState);
    } else {
      set(statsCheckinLogState, (prevState) => [...prevState, logEntry]);
    }
  },
});

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

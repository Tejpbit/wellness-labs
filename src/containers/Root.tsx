import _ from "lodash";
import { useState } from "react";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import styled from "styled-components";
import { Button } from "../components/Button";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { StatCheckin } from "../components/StatCheckin";
import { Home } from "../pages/Home";
import { LogOverview } from "../pages/LogOverview";
import { Statistics } from "../pages/Statistics";
import { StatsCheckin } from "../pages/StatsCheckin";
import {
  LogEntry,
  selectedDateState,
  singleStatWriter,
  statDefinitionsState,
} from "../store";

const ROOT_PATH = "wellness-labs";

export const Root = () => (
  <RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route path={`/${ROOT_PATH}`} element={<Container />}>
          <Route index element={<Home />}></Route>
          <Route path="statsCheckin" element={<StatsCheckin />}>
            <Route index element={<div>checkin today or another date?</div>} />
            <Route path=":checkinDate" element={<StatsCheckinForm />} />
            <Route path="today" element={<StatsCheckinForm />} />
          </Route>
          <Route path="statistics" element={<Statistics />} />
          <Route path="logOverview" element={<LogOverview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </RecoilRoot>
);

const WholeScreenSize = styled.div`
  height: 100vh;
  width: 100vw;
`;

const Container = () => (
  <WholeScreenSize>
    <Outlet />
  </WholeScreenSize>
);

const StatsCheckinForm = () => {
  const [statDefinitions] = useRecoilState(statDefinitionsState);
  const writeStatToLog = useSetRecoilState(singleStatWriter);
  const [statIndex, setStatIndex] = useState(0);
  const [hasFinishedCheckin, setHasFinishedCheckin] = useState(false);
  const checkinTimestamp = useRecoilValue(selectedDateState);

  const goToNextStat = () => {
    if (statIndex + 1 === statDefinitions.length) {
      setHasFinishedCheckin(true);
    }
    setStatIndex(_.min([statIndex + 1, statDefinitions.length - 1]) || 0);
  };

  const statDef = statDefinitions[statIndex];
  return (
    <Column>
      {hasFinishedCheckin ? (
        <FinishCheckinPage
          editCheckin={() => {
            setHasFinishedCheckin(false);
          }}
        />
      ) : (
        <>
          <StatCheckin
            key={statDef.name}
            checkinTimestamp={checkinTimestamp}
            statDefinition={statDef}
            paramSubmitted={(logEntry: LogEntry) => {
              console.log("Entry to write", logEntry);
              writeStatToLog(logEntry);
              goToNextStat();
            }}
          />

          <Row justifyContent="center">
            <ProgressIndicator
              steps={statDefinitions.length}
              current={statIndex}
            />
          </Row>
          <Footer>
            <Row>
              <Button
                disabled={statIndex === 0}
                onClick={() => setStatIndex(statIndex - 1)}
              >
                {"<"}
              </Button>
              <Button
                disabled={statIndex === statDefinitions.length - 1}
                onClick={goToNextStat}
              >
                {">"}
              </Button>
            </Row>
          </Footer>
        </>
      )}
    </Column>
  );
};

export const Footer = styled.div`
  justify-self: end;
  bottom: 0px;
  width: 100vw;
`;

export const FlexBox = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Row = styled.div<{
  justifyContent?: string;
  alignSelf?: string;
}>`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent || "left"};
  align-self: ${({ alignSelf }) => alignSelf};
`;

export const ScrollRow = styled(Row)`
  overflow: scroll;
`;

export const Column = styled.div<{
  justifyContent?: string;
  alignItems?: string;
}>`
  display: flex;
  flex-direction: column;
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  height: 100%;
`;

export const ScrollColumn = styled(Column)`
  overflow: scroll;
`;

interface FinishCheckinPageProps {
  editCheckin: () => void;
}

const FinishCheckinPage: React.FC<FinishCheckinPageProps> = ({
  editCheckin,
}) => {
  const navigate = useNavigate();
  return (
    <Column justifyContent="space-between">
      <Column justifyContent="center">
        <H1>You have finished todays checkin. Nicely done!</H1>
      </Column>
      <Row>
        <Button onClick={editCheckin}>Edit checkin</Button>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </Row>
    </Column>
  );
};

const H1 = styled.h1`
  text-align: center;
`;

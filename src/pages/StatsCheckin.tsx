import { Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Button } from "../components/Button";
import { Column, Row } from "../containers/Root";
import { selectedDateState } from "../store";
import Moment from "moment";
import styled from "styled-components";

export const StatsCheckin: React.FC = () => {
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);
  const daysBetweenTodayAndSelectedDate = Moment().diff(selectedDate, "days");

  let daysSuffix = null;
  switch (daysBetweenTodayAndSelectedDate) {
    case 0:
      daysSuffix = "Today";
      break;
    case 1:
      daysSuffix = "day ago";
      break;
    default:
      daysSuffix = "days ago";
  }

  const goToPreviousDay = () =>
    setSelectedDate(selectedDate.clone().subtract(1, "day"));
  const goToNextDay = () => setSelectedDate(selectedDate.clone().add(1, "day"));

  return (
    <Column>
      <Row>
        <Button flex={1} onClick={() => goToPreviousDay()}>
          {"<"}
        </Button>
        <Button flex={3} onClick={() => {}}>
          <Column>
            {selectedDate.format("MMM Do YYYY")}
            <SubHeader>
              {daysBetweenTodayAndSelectedDate === 0
                ? "Today"
                : `${daysBetweenTodayAndSelectedDate} ${daysSuffix}`}
            </SubHeader>
          </Column>
        </Button>
        <Button
          disabled={selectedDate.clone().add(1, "day").isAfter(Moment())}
          flex={1}
          onClick={() => goToNextDay()}
        >
          {">"}
        </Button>
      </Row>
      <Outlet />
    </Column>
  );
};

const SubHeader = styled.span`
  font-size: 14px;
  color: #000000;
`;

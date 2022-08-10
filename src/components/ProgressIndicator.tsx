import { Row } from "../containers/Root";
import _ from "lodash";
import styled from "styled-components";
interface ProgressIndicatorProps {
  steps: number;
  current: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  current,
}) => {
  return (
    <Row>
      {_.range(0, steps).map((i) => (
        <Indicator key={i} isCurrent={i === current} />
      ))}
    </Row>
  );
};

const Indicator = styled.div<{ isCurrent: boolean }>`
  background-color: ${({ isCurrent }) => (isCurrent ? "black" : "grey")};
  width: 5px;
  height: 5px;
  margin: 5px;
  border-radius: 50%;
`;

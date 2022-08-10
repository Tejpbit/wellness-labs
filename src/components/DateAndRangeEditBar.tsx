import { Column } from "../containers/Root";
import { Button } from "./Button";

interface Props {
  moveRange: () => void;
  moveText: string;
  expandRange: () => void;
  shrinkRange: () => void;
}

export const DateAndRangeEditBar: React.FC<Props> = ({
  moveRange,
  moveText,
  expandRange,
  shrinkRange,
}) => {
  return (
    <Column>
      <Button onClick={expandRange}>+</Button>
      <Button onClick={moveRange}>{moveText}</Button>
      <Button onClick={shrinkRange}>-</Button>
    </Column>
  );
};

import { NavButton } from "../components/NavButton";
import { Spacer } from "../components/Spacer";
import { Screen } from "../containers/Screen";

export const Home: React.FC = () => {
  return (
    <Screen>
      <NavButton to="/statsCheckin/today" text="Checkin Stats" />
      <Spacer />
      <NavButton to="/experimentCheckin" text="Checkin Experiment" />
      <Spacer />
      <NavButton to="/experiments" text="Experiments" />
      <Spacer />
      <NavButton to="/statistics" text="Statistics" />
    </Screen>
  );
};

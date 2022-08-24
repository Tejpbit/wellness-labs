import styled from "styled-components";
import { useNavigateWithPageRoot } from "../hooks/useNavigateWithPageRoot";

interface NavButtonProps {
  to: string;
  text: string;
}

export const NavButton: React.FC<NavButtonProps> = ({ text, to }) => {
  const navigate = useNavigateWithPageRoot();
  return (
    <NavButtonContainer onClick={() => navigate(to)}>{text}</NavButtonContainer>
  );
};

const NavButtonContainer = styled.div`
  display: block;
  cursor: pointer;
  background-color: green;
  color: white;
  text-align: center;
  padding: 10px;
  &:active {
    opacity: 0.8;
  }
`;

import { useNavigate } from "react-router";
import styled from "styled-components";

interface NavButtonProps {
  to: string;
  text: string;
}

export const NavButton: React.FC<NavButtonProps> = ({ text, to }) => {
  const navigate = useNavigate();
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

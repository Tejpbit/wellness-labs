import styled from "styled-components";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  flex?: number;
}

export const Button: React.FC<ButtonProps> = ({
  disabled = false,
  flex = 1,
  children,
  onClick,
}) => {
  return (
    <ButtonContainer
      flex={flex}
      disabled={disabled}
      onClick={() => (disabled ? "" : onClick())}
    >
      {children}
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div<{ flex: number; disabled: boolean }>`
  flex: ${({ flex }) => flex};
  display: flex;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background-color: ${({ disabled }) => (disabled ? "darkgreen" : "green")};
  color: white;
  text-align: center;
  padding: 10px;
  &:active {
    opacity: ${({ disabled }) => (disabled ? 1 : 0.8)};
  }
  justify-content: center;
  align-items: center;

  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  -o-user-select: none;
  -moz-user-select: none;
`;

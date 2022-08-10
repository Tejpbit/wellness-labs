import styled from "styled-components";

interface ScreenProps {
    children?: React.ReactNode;
}

export const Screen: React.FC<ScreenProps> = ({ children }) => {
    return <ScreenContainer>
        {children}
    </ScreenContainer>
}

const ScreenContainer = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
`;
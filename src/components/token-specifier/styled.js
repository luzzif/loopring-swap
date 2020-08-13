import styled from "styled-components";
import { Flex, Box } from "reflexbox";

export const RootFlex = styled(Flex)`
    background: ${(props) => props.theme.background};
    border: solid 1px ${(props) => props.theme.border};
    border-radius: 4px;
    padding: 16px 16px 12px 16px;
    flex-direction: column;
    width: 100%;
`;

export const HeaderText = styled(Box)`
    font-size: 16px;
`;

export const Input = styled.input`
    font-size: 24px;
    color: ${(props) => props.theme.text};
    font-family: "Montserrat", sans-serif;
    border: none;
    background: ${(props) => props.theme.background};
    outline: none;
    line-height: 24px;
    ::placeholder {
        color: ${(props) => props.theme.placeholder};
    }
`;
import styled from "styled-components";
import { Flex, Box } from "reflexbox";

export const RootFlex = styled(Flex)`
    background: ${(props) => props.theme.background};
    border: solid 1px
        ${(props) => (props.error ? props.theme.error : props.theme.border)};
    border-radius: 12px;
    padding: 12px 12px 8px 12px;
    flex-direction: column;
    width: 100%;
    transition: background 0.3s ease, border 0.3s ease;
`;

export const HeaderText = styled(Box)`
    font-size: 16px;
`;

export const Input = styled.input`
    font-size: 32px;
    color: ${(props) => props.theme.text};
    font-family: "Work Sans", sans-serif;
    border: none;
    background: ${(props) => props.theme.background};
    transition: background 0.3s ease, color 0.3s ease;
    outline: none;
    line-height: 40px;
    width: 100%;
    height: 40px;
    ::placeholder {
        transition: color 0.3s ease;
        color: ${(props) => props.theme.placeholder};
    }
`;

import styled from "styled-components";
import { Flex, Box } from "reflexbox";
import NumberFormat from "react-number-format";

export const RootFlex = styled(Flex)`
    background: ${(props) => props.theme.background};
    border: solid 1px ${(props) => props.theme.border};
    border-radius: 12px;
    padding: 12px 12px 8px 12px;
    flex-direction: column;
    width: 100%;
    transition: background 0.3s ease, border 0.3s ease;
`;

export const HeaderText = styled(Box)`
    font-size: 16px;
`;

export const Input = styled(NumberFormat)`
    font-size: 32px;
    color: ${(props) => props.theme.text};
    font-family: Montserrat, sans-serif;
    border: none;
    background: ${(props) => props.theme.background};
    transition: background 0.3s ease, color 0.3s ease;
    outline: none;
    line-height: 32px;
    width: 100%;
    height: 32px;
    ::placeholder {
        transition: color 0.3s ease;
        color: ${(props) => props.theme.placeholder};
    }
`;

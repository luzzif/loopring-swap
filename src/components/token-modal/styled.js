import styled from "styled-components";
import { Flex, Box } from "reflexbox";

export const RootFlex = styled(Flex)`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;
    justify-content: center;
    align-items: center;
    opacity: ${(props) => (props.open ? "1" : "0")};
    transform: translateY(${(props) => (props.open ? "0" : "100%")});
    transition: ${(props) =>
        props.open
            ? "opacity 0.3s ease"
            : "transform 0.3s ease 0.3s, opacity 0.3s ease"};
`;

export const ContentFlex = styled(Flex)`
    background: ${(props) => props.theme.background};
    border-radius: 12px;
    max-height: 70%;
    overflow: auto;
    box-shadow: 0px 30px 62px 0px ${(props) => props.theme.shadow};
`;

export const ListFlex = styled(Flex)`
    overflow: auto;
`;

export const HeaderFlex = styled(Flex)`
    width: 100%;
    align-items: center;
    justify-content: space-between;
    background: ${(props) => props.theme.foreground};
    padding-top: 12px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 20px;
    font-weight: 700;
    color: ${(props) => props.theme.text};
`;

export const SearchFlex = styled(Flex)`
    width: 100%;
    height: 52px;
    min-height: 52px;
    align-items: center;
    background: ${(props) => props.theme.foreground};
    padding-left: 20px;
    padding-right: 20px;
    font-size: 20px;
    color: ${(props) => props.theme.text};
`;

export const Input = styled.input`
    font-size: 16px;
    color: ${(props) => props.theme.text};
    font-family: "Montserrat", sans-serif;
    border: none;
    background: ${(props) => props.theme.foreground};
    outline: none;
    width: 100%;
    ::placeholder {
        color: ${(props) => props.theme.placeholder};
    }
`;

export const RowFlex = styled(Flex)`
    transition: background 0.3s ease;
    cursor: pointer;
    background: ${(props) =>
        props.selected ? props.theme.foreground : props.theme.background};
    border-radius: 12px;
    :hover {
        background: ${(props) => props.theme.foreground};
    }
`;

export const CloseBox = styled(Box)`
    cursor: pointer;
`;

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
    transform: translateY(${(props) => (props.open ? "0" : "100%")});
    transition: transform 0.3s ease;
`;

export const ContentFlex = styled(Flex)`
    background: ${(props) => props.theme.background};
    border-radius: 12px;
    max-height: 60%;
    overflow: auto;
    box-shadow: 0px 30px 62px 0px ${(props) => props.theme.shadow};
`;

export const ListFlex = styled(Flex)`
    overflow: auto;
`;

export const HeaderFlex = styled(Flex)`
    width: 100%;
    height: 64px;
    min-height: 60px;
    align-items: center;
    justify-content: space-between;
    background: ${(props) => props.theme.foreground};
    padding-left: 20px;
    padding-right: 20px;
    font-size: 20px;
    font-weight: 700;
    color: ${(props) => props.theme.text};
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

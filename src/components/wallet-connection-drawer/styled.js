import { Button } from "../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex, Box } from "reflexbox";
import styled from "styled-components";

export const RootFlex = styled(Flex)`
    width: 272px;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    transition: transform 0.3s ease;
    transform: translateX(${(props) => (props.open ? "0" : "100%")});
    background: ${(props) => props.theme.background};
    box-shadow: 0px 30px 62px 0px ${(props) => props.theme.shadow};
    overflow-y: auto;
`;

export const HeaderBox = styled(Box)`
    width: 100%;
    height: 56px;
    min-height: 56px;
    display: flex;
    align-items: center;
    background: ${(props) => props.theme.foreground};
    padding-left: 16px;
    padding-right: 16px;
    font-size: 16px;
    font-weight: 700;
    color: ${(props) => props.theme.text};
`;

export const EllipsizedText = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const Icon = styled(FontAwesomeIcon)`
    font-size: 40px;
`;

export const FullWidthButton = styled(Button)`
    width: 100%;
`;
export const Divider = styled.div`
    height: 1px;
    background: ${(props) => props.theme.divider};
`;

export const ListItemHeader = styled(Box)`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 20px;
    font-size: 12px;
    font-weight: 700;
    color: ${(props) => props.theme.textLight};
    margin-bottom: 16px;
`;

export const ListItemBox = styled(Box)`
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 20px;
    min-height: 40px;
    height: 40px;
    font-size: 12px;
    color: ${(props) => props.theme.text};
    background: ${(props) => props.theme.background};
    :hover {
        color: ${(props) => props.theme.textInverted};
        background: ${(props) => props.theme.primary};
    }
    transition: color 0.3s ease, background 0.3s ease;
`;

export const ListItemIcon = styled(FontAwesomeIcon)`
    margin-right: 8px;
`;

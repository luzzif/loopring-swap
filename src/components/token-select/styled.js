import styled from "styled-components";
import { Flex } from "reflexbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const RootFlex = styled(Flex)`
    border: solid 1px ${(props) => props.theme.border};
    border-radius: 12px;
    padding: 4px 12px;
    font-size: 16px;
    background: ${(props) => props.theme.foreground};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
`;

export const ChevronIcon = styled(FontAwesomeIcon)`
    color: ${(props) => props.theme.primary};
    font-size: 12px;
    color: ${(props) => props.theme.primary};
`;

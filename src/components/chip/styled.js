import styled from "styled-components";
import { Flex } from "reflexbox";

export const RootFlex = styled(Flex)`
    border: solid 1px ${(props) => props.theme.border};
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 12px;
    background: ${(props) =>
        props.selected ? props.theme.primary : props.theme.foreground};
    color: ${(props) =>
        props.selected ? props.theme.textInverted : props.theme.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: background 0.3s ease, border 0.3s ease, color 0.3s ease;
    cursor: pointer;
`;

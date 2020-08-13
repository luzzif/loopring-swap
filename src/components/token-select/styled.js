import styled from "styled-components";
import { Flex } from "reflexbox";

export const RootFlex = styled(Flex)`
    border: solid 1px ${(props) => props.theme.border};
    border-radius: 12px;
    padding: 4px 8px;
    font-size: 16px;
    background: ${(props) => props.theme.foreground};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
`;

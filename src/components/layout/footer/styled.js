import styled from "styled-components";
import { Flex } from "reflexbox";

export const FlexContainer = styled(Flex)`
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
    align-items: center;
    justify-content: center;
    font-size: 12px;
`;

export const WarningText = styled.span`
    color: ${(props) => props.theme.error};
`;

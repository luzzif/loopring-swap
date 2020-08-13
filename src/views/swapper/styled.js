import styled from "styled-components";
import { Flex } from "reflexbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const BackgroundFlex = styled(Flex)`
    border: solid 1px ${(props) => props.theme.border};
    border-radius: 12px;
    background: ${(props) => props.theme.foreground};
    padding: 28px 16px;
`;

export const ArrowIcon = styled(FontAwesomeIcon)`
    color: ${(props) => props.theme.primary};
`;
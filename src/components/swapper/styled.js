import styled from "styled-components";
import { Flex } from "reflexbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../button";

export const BackgroundFlex = styled(Flex)`
    border: solid 1px ${(props) => props.theme.border};
    border-radius: 4px;
    background: ${(props) => props.theme.foreground};
    padding: 12px;
`;

export const ArrowIcon = styled(FontAwesomeIcon)`
    color: ${(props) => props.theme.primary};
`;

export const FullWidthButton = styled(Button)`
    width: 100%;
`;

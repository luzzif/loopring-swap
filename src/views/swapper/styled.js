import styled from "styled-components";
import { Flex, Box } from "reflexbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const BackgroundFlex = styled(Flex)`
    border: solid 1px ${(props) => props.theme.border};
    border-radius: 12px;
    background: ${(props) => props.theme.foreground};
    padding: 16px;
    transition: background 0.3s ease, border 0.3s ease;
`;

export const ArrowIcon = styled(FontAwesomeIcon)`
    color: ${(props) => props.theme.primary};
`;

export const SlippageText = styled.span`
    color: ${(props) => props.theme.error};
`;

export const FeeTextBox = styled(Box)`
    color: ${(props) => props.theme.success};
`;

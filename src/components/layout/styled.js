import styled from "styled-components";
import { Flex } from "reflexbox";

export const Root = styled(Flex)`
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    transition: background 0.3s ease, color 0.3s ease;
    width: 100%;
    height: 100%;
`;

export const ContentContainer = styled.div`
    width: 100%;
    height: 100%;
`;

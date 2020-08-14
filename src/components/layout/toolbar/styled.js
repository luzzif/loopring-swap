import styled from "styled-components";
import { Flex } from "reflexbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const FlexContainer = styled(Flex)`
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
    height: 60px;
    align-items: center;
    justify-content: space-between;
`;

export const Logo = styled.img`
    height: 100%;
`;

export const PointableIcon = styled(FontAwesomeIcon)`
    font-size: 24px;
    cursor: pointer;
`;

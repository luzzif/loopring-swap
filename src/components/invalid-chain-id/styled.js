import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
    font-size: 60px;
    color: ${(props) => props.theme.error};
`;

export const Text = styled.span`
    color: ${(props) => props.theme.error};
`;

import styled from "styled-components";
import { Box } from "reflexbox";

export const TextBox = styled(Box)`
    color: ${(props) => props.theme.text};
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
`;

import React from "react";
import styled, { css } from "styled-components";
import { Flex, Box } from "reflexbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const commonsStyles = css`
    display: flex;
    white-space: nowrap;
    padding: 4px 16px;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    height: 36px;
    font-family: "Montserrat", sans-serif;
    background: ${(props) => props.theme.primary};
    color: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 4px;
    font-weight: 600;
    transition: all 0.3s ease;
    outline: none;
    cursor: pointer;
    text-decoration: none;
`;

const StyledButton = styled.button`
    ${commonsStyles}
`;

export const Button = ({ children, faIcon, ...rest }) => (
    <StyledButton {...rest}>
        <Flex>
            {faIcon && (
                <Box mr={2}>
                    <FontAwesomeIcon icon={faIcon} />
                </Box>
            )}
            <Box>{children}</Box>
        </Flex>
    </StyledButton>
);

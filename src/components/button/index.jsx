import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { Flex, Box } from "reflexbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const sizeMap = {
    small: {
        height: 32,
        fontSize: 12,
    },
    medium: {
        height: 36,
        fontSize: 16,
    },
    large: {
        height: 48,
        fontSize: 16,
    },
};

const commonsStyles = css`
    display: flex;
    white-space: nowrap;
    justify-content: center;
    align-items: center;
    height: ${(props) => sizeMap[props.size].height}px;
    padding: 0 20px;
    font-size: ${(props) => sizeMap[props.size].fontSize}px;
    font-family: "Work Sans", sans-serif;
    background: ${(props) =>
        props.disabled ? props.theme.disabled : props.theme.primary};
    color: ${(props) =>
        props.disabled ? props.theme.textDisabled : "rgba(255, 255, 255, 0.8)"};
    border: none;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    outline: none;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    text-decoration: none;
`;

const StyledButton = styled.button`
    ${commonsStyles}
`;

export const Button = ({ children, faIcon, size, ...rest }) => (
    <StyledButton size={size} {...rest}>
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

Button.propTypes = {
    faIcon: PropTypes.object,
    size: PropTypes.oneOf(["small", "medium", "large"]),
};

Button.defaultProps = {
    size: "medium",
};

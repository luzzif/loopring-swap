import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

export const SpinningIcon = styled(FontAwesomeIcon)`
    color: ${(props) => {
        if (props.variant === "primary") {
            return props.theme.primary;
        } else if (props.variant === "buttonText") {
            return props.theme.textButton;
        }
    }};
    animation: ${spin} 1s linear 0s infinite;
    font-size: ${(props) => props.size}px;
`;

export const Spinner = ({ size, variant }) => {
    return <SpinningIcon size={size} variant={variant} icon={faCircleNotch} />;
};

Spinner.propTypes = {
    size: PropTypes.number.isRequired,
    variant: PropTypes.oneOf(["primary", "buttonText"]),
};

Spinner.defaultProps = {
    variant: "primary",
};

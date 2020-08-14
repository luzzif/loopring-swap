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
    color: ${(props) => props.theme.primary};
    animation: ${spin} 1s linear 0s infinite;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
`;

export const Spinner = ({ size }) => {
    return <SpinningIcon size={size} icon={faCircleNotch} />;
};

Spinner.propTypes = {
    size: PropTypes.number.isRequired,
};

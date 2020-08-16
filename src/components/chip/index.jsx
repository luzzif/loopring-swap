import React from "react";
import PropTypes from "prop-types";
import { RootFlex } from "./styled";

export const Chip = ({ selected, onClick, children }) => (
    <RootFlex alignItems="center" onClick={onClick} selected={selected}>
        {children}
    </RootFlex>
);

Chip.propTypes = {
    children: PropTypes.node.isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

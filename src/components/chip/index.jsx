import React from "react";
import PropTypes from "prop-types";
import { RootFlex } from "./styled";

export const Chip = ({ selected, onClick, children }) => (
    <RootFlex alignItems="center" onClick={onClick} selected={selected}>
        {children}
    </RootFlex>
);

Chip.propTypes = {
    token: PropTypes.shape({
        address: PropTypes.string,
        symbol: PropTypes.string.isRequired,
    }),
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

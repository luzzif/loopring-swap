import React from "react";
import PropTypes from "prop-types";
import { TokenIcon } from "../token-icon";
import { Box } from "reflexbox";
import { RootFlex, ChevronIcon } from "./styled";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export const TokenSelect = ({ token, onClick }) => (
    <RootFlex alignItems="center" onClick={onClick}>
        {token ? (
            <>
                <Box mr={2} display="flex" alignItems="center">
                    <TokenIcon address={token.address || "ETH"} size={16} />
                </Box>
                <Box>{token.symbol}</Box>
            </>
        ) : (
            "Select a token"
        )}
        <Box ml={2} display="flex" alignItems="center">
            <ChevronIcon icon={faChevronDown} />
        </Box>
    </RootFlex>
);

TokenSelect.propTypes = {
    token: PropTypes.shape({
        address: PropTypes.string,
        symbol: PropTypes.string.isRequired,
    }),
    onClick: PropTypes.func.isRequired,
};

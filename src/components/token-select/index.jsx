import React from "react";
import PropTypes from "prop-types";
import { TokenIcon } from "../token-icon";
import { Box } from "reflexbox";
import { RootFlex, ChevronIcon, LabelBox } from "./styled";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FormattedMessage } from "react-intl";
import { Spinner } from "../spinner";

export const TokenSelect = ({ token, loading, onClick }) => (
    <RootFlex alignItems="center" onClick={onClick}>
        {loading ? (
            <>
                <Box mr="4px">
                    <Spinner size={16} />
                </Box>
                <LabelBox>
                    <FormattedMessage id="token.select.loading" />
                </LabelBox>
            </>
        ) : (
            <>
                {token ? (
                    <>
                        <Box mr="4px" display="flex" alignItems="center">
                            <TokenIcon
                                address={token.address || "ETH"}
                                size={16}
                            />
                        </Box>
                        <LabelBox>{token.symbol}</LabelBox>
                    </>
                ) : (
                    <LabelBox>
                        <FormattedMessage id="token.select.action.select" />
                    </LabelBox>
                )}
                <Box ml="4px" display="flex" alignItems="center">
                    <ChevronIcon icon={faChevronDown} />
                </Box>
            </>
        )}
    </RootFlex>
);

TokenSelect.propTypes = {
    token: PropTypes.shape({
        address: PropTypes.string,
        symbol: PropTypes.string.isRequired,
    }),
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

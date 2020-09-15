import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { RootFlex, HeaderText, Input } from "./styled";
import { Box, Flex } from "reflexbox";
import { FormattedMessage } from "react-intl";
import { TokenSelect } from "../token-select";
import { TokenModal } from "../token-modal";

export const TokenSpecifier = ({
    variant,
    amount,
    token,
    onAmountChange,
    onBalancesRefresh,
    onTokenChange,
    supportedTokens,
    balances,
    loadingSupportedTokens,
    loadingBalances,
    loggedIn,
}) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleAmountChange = useCallback(
        (wrappedAmount) => {
            onAmountChange(wrappedAmount.value);
        },
        [onAmountChange]
    );

    const handleSelectClick = useCallback(() => {
        setModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
    }, []);

    const handleTokenChange = useCallback(
        (token) => {
            onTokenChange(token);
        },
        [onTokenChange]
    );

    return (
        <>
            <RootFlex>
                <HeaderText width="100%" mb={2}>
                    <FormattedMessage id={`token.specifier.${variant}`} />
                </HeaderText>
                <Flex width="100%" alignItems="flex-end">
                    <Box flex="1">
                        <Input
                            thousandSeparator=","
                            decimalSeparator="."
                            value={amount}
                            placeholder="0.0"
                            decimalScale={token ? token.precision : undefined}
                            onValueChange={handleAmountChange}
                        />
                    </Box>
                    <Box display="flex" alignItems="center" ml={2} mb="2px">
                        <TokenSelect
                            token={token}
                            onClick={handleSelectClick}
                            loading={loadingSupportedTokens}
                        />
                    </Box>
                </Flex>
            </RootFlex>
            <TokenModal
                open={modalOpen}
                onClose={handleModalClose}
                onRefresh={onBalancesRefresh}
                onChange={handleTokenChange}
                supportedTokens={supportedTokens}
                selected={token}
                balances={balances}
                loading={loadingBalances || loadingSupportedTokens}
                loggedIn={loggedIn}
            />
        </>
    );
};

TokenSpecifier.propTypes = {
    variant: PropTypes.oneOf(["from", "to"]),
    amount: PropTypes.string.isRequired,
    token: PropTypes.object,
    changing: PropTypes.bool,
    onAmountChange: PropTypes.func.isRequired,
    onBalancesRefresh: PropTypes.func.isRequired,
    onTokenChange: PropTypes.func.isRequired,
    supportedTokens: PropTypes.array.isRequired,
    loadingSupportedTokens: PropTypes.bool.isRequired,
    loadingBalances: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
};

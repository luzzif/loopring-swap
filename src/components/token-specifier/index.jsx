import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { RootFlex, HeaderText, Input } from "./styled";
import { Box, Flex } from "reflexbox";
import BigNumber from "bignumber.js";
import { fromWei, toWei } from "web3-utils";
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
    const [stringAmount, setStringAmount] = useState("");
    const [amountError, setAmountError] = useState(false);

    useEffect(() => {
        if (
            stringAmount.indexOf(".") < 0 &&
            stringAmount !== "0" &&
            amount === "0"
        ) {
            setStringAmount("0");
        } else if (
            (!stringAmount.endsWith(".") &&
                !new BigNumber(fromWei(amount)).isZero()) ||
            (!/^0?\.0*/.test(stringAmount) &&
                stringAmount !== "0" &&
                amount === "0")
        ) {
            if (stringAmount !== "0" && amount === "0") {
                setStringAmount("0");
                return;
            }
            let weiAmount = new BigNumber(amount);
            const exchangeBalance = balances.find(
                (balance) => balance.id === token.tokenId
            );
            const tokenMaximumExchangeBalance =
                exchangeBalance && exchangeBalance.balance;
            if (weiAmount.isGreaterThan(tokenMaximumExchangeBalance)) {
                weiAmount = tokenMaximumExchangeBalance;
                onAmountChange(weiAmount.toFixed());
            }
            setStringAmount(
                new BigNumber(fromWei(weiAmount.decimalPlaces(0).toFixed()))
                    .decimalPlaces(5)
                    .toString()
            );
        }
    }, [amount, balances, onAmountChange, stringAmount, token]);

    const handleAmountChange = useCallback(
        (event) => {
            const newAmount = event.target.value;
            let numericAmount = parseFloat(newAmount);
            if (
                !newAmount ||
                newAmount.indexOf(",") >= 0 ||
                newAmount.indexOf(" ") >= 0 ||
                newAmount.indexOf("-") >= 0
            ) {
                setAmountError(newAmount);
                onAmountChange("0");
                return;
            }
            setAmountError(newAmount.endsWith("."));
            if (/\.{2,}/.test(newAmount) || newAmount.split(".").length > 2) {
                return;
            }
            setStringAmount(newAmount);
            let properNumericValue = isNaN(numericAmount)
                ? "0"
                : new BigNumber(numericAmount.toString())
                      .decimalPlaces(18)
                      .toString();
            const userTokenBalance =
                token &&
                balances.find((balance) => balance.id === token.tokenId);
            if (
                userTokenBalance &&
                userTokenBalance.balance &&
                userTokenBalance.balance.isLessThan(toWei(properNumericValue))
            ) {
                properNumericValue = fromWei(
                    userTokenBalance.balance.decimalPlaces(18).toFixed()
                );
            }
            onAmountChange(toWei(properNumericValue));
        },
        [balances, onAmountChange, token]
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
            <RootFlex error={amountError}>
                <HeaderText width="100%" mb={2}>
                    <FormattedMessage id={`token.specifier.${variant}`} />
                </HeaderText>
                <Flex width="100%">
                    <Box flex="1">
                        <Input
                            placeholder="0.0"
                            value={
                                stringAmount && stringAmount !== "0"
                                    ? stringAmount
                                    : ""
                            }
                            onChange={handleAmountChange}
                        />
                    </Box>
                    <Box display="flex" alignItems="center" ml={2}>
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
    onAmountChange: PropTypes.func.isRequired,
    onBalancesRefresh: PropTypes.func.isRequired,
    onTokenChange: PropTypes.func.isRequired,
    supportedTokens: PropTypes.array.isRequired,
    loadingSupportedTokens: PropTypes.bool.isRequired,
    loadingBalances: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
};

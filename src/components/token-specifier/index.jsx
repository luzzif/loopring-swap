import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { RootFlex, HeaderText, Input } from "./styled";
import { Box, Flex } from "reflexbox";
import { toWei, fromWei } from "web3-utils";
import { FormattedMessage } from "react-intl";
import { TokenSelect } from "../token-select";
import { TokenModal } from "../token-modal";
import { useEffect } from "react";
import BigNumber from "bignumber.js";

export const TokenSpecifier = ({
    variant,
    amount,
    token,
    changing,
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

    useEffect(() => {
        if (changing && stringAmount.includes(".")) {
            return;
        }
        if (
            (amount === "0" && amount !== stringAmount) ||
            (!changing &&
                amount === "0" &&
                (!stringAmount || stringAmount === "0"))
        ) {
            setStringAmount("");
        } else if (
            (!changing && amount && amount !== "0" && !stringAmount) ||
            (stringAmount && toWei(stringAmount) !== amount) ||
            (changing && !stringAmount && amount === "0")
        ) {
            setStringAmount(
                new BigNumber(fromWei(amount)).decimalPlaces(4).toFixed()
            );
        }
    }, [amount, changing, stringAmount]);

    const handleAmountChange = useCallback(
        (event) => {
            const newAmount = event.target.value;
            if (/^\d+(\.\d*)?$/.test(newAmount)) {
                setStringAmount(newAmount);
                let newAmountWei = toWei(event.target.value);
                const userTokenBalance =
                    token &&
                    balances.find((balance) => balance.id === token.tokenId);
                if (
                    userTokenBalance &&
                    userTokenBalance.balance &&
                    userTokenBalance.balance.isLessThan(newAmountWei)
                ) {
                    newAmountWei = userTokenBalance.balance
                        .decimalPlaces(18)
                        .toFixed();
                }
                onAmountChange(newAmountWei);
            } else {
                onAmountChange("0");
            }
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
            <RootFlex>
                <HeaderText width="100%" mb={2}>
                    <FormattedMessage id={`token.specifier.${variant}`} />
                </HeaderText>
                <Flex width="100%">
                    <Box flex="1">
                        <Input
                            placeholder="0.0"
                            value={stringAmount}
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
    changing: PropTypes.bool,
    onAmountChange: PropTypes.func.isRequired,
    onBalancesRefresh: PropTypes.func.isRequired,
    onTokenChange: PropTypes.func.isRequired,
    supportedTokens: PropTypes.array.isRequired,
    loadingSupportedTokens: PropTypes.bool.isRequired,
    loadingBalances: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
};

import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { BackgroundFlex, ArrowIcon, ErrorMessage } from "./styled";
import { TokenSpecifier } from "../../components/token-specifier";
import { useState } from "react";
import {
    faArrowDown,
    faExchangeAlt,
    faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FormattedMessage } from "react-intl";
import { Button } from "../../components/button";
import { useSelector, useDispatch } from "react-redux";
import { getExchangeRate } from "../../actions/loopring";
import BigNumber from "bignumber.js";
import { fromWei, toWei } from "web3-utils";
import { Spinner } from "../../components/spinner";

export const Swapper = ({ onConnectWalletClick }) => {
    const dispatch = useDispatch();

    const {
        supportedTokens,
        loadingSupportedTokens,
        supportedFromTokens,
        supportedToTokens,
        supportedMarkets,
        balances,
        loggedIn,
        exchangeRate,
        loadingExchangeRate,
    } = useSelector((state) => ({
        supportedTokens: state.loopring.supportedTokens.data.aggregated,
        loadingSupportedTokens: !!state.loopring.supportedTokens.loadings,
        supportedFromTokens: state.loopring.supportedTokens.data.fromTokens,
        supportedToTokens: state.loopring.supportedTokens.data.toTokens,
        supportedMarkets: state.loopring.supportedMarkets.data,
        balances: state.loopring.balances.data,
        loggedIn: !!state.loopring.account,
        exchangeRate: state.loopring.exchangeRate.data,
        loadingExchangeRate: !!state.loopring.exchangeRate.loadings,
    }));

    const [fromToken, setFromToken] = useState(null);
    const [fromAmount, setFromAmount] = useState("0");
    const [toToken, setToToken] = useState(null);
    const [toAmount, setToAmount] = useState("0");
    const [filteredToTokens, setFilteredToTokens] = useState([]);
    const [compatibleMarkets, setCompatibleMarkets] = useState([]);
    const [changingTo, setChangingTo] = useState(false);

    // set ether as the default "from" token
    useEffect(() => {
        if (supportedTokens && supportedTokens.length > 0 && !fromToken) {
            setFromToken(
                supportedTokens.find((token) => token.symbol === "ETH")
            );
        }
    }, [fromToken, supportedTokens]);

    // on "from" token change, find out the compatible markets
    useEffect(() => {
        if (supportedMarkets && supportedMarkets.length > 0 && fromToken) {
            setCompatibleMarkets(
                supportedMarkets.filter(
                    (market) => market.quoteTokenId === fromToken.tokenId
                )
            );
        }
    }, [fromToken, supportedMarkets]);

    // on "from" token change, we need to find the compatible "to" tokens based on available markets.
    // Plus, we reset the currently selected "to" token if it's not compatible with the current "from" one.
    useEffect(() => {
        if (supportedMarkets && supportedMarkets.length > 0 && fromToken) {
            const filteredToTokens = supportedToTokens.filter((token) =>
                compatibleMarkets.find(
                    (market) => market.baseTokenId === token.tokenId
                )
            );
            if (
                filteredToTokens &&
                filteredToTokens.length > 0 &&
                toToken &&
                !filteredToTokens.find(
                    (token) => token.tokenId === toToken.tokenId
                )
            ) {
                setToToken(filteredToTokens[0]);
                setToAmount("0");
            }
            setFilteredToTokens(filteredToTokens);
        }
    }, [
        compatibleMarkets,
        fromToken,
        supportedMarkets,
        supportedToTokens,
        toToken,
    ]);

    // on valid "from" and "to" tokens setting, we need to find their current exchange rate
    useEffect(() => {
        if (
            supportedTokens &&
            supportedTokens.length > 0 &&
            fromToken &&
            toToken &&
            fromAmount !== "0" &&
            !!compatibleMarkets.find(
                (market) =>
                    market.baseTokenId === toToken.tokenId &&
                    market.quoteTokenId === fromToken.tokenId
            )
        ) {
            dispatch(getExchangeRate(fromToken, toToken, supportedTokens));
        }
    }, [
        changingTo,
        compatibleMarkets,
        dispatch,
        fromAmount,
        fromToken,
        supportedTokens,
        toToken,
    ]);

    // when the exchange rate is fetched, we need to calculate the expected
    // token amount to receive based on it
    useEffect(() => {
        if (
            exchangeRate &&
            exchangeRate.price &&
            fromToken &&
            fromAmount &&
            toToken
        ) {
            const referenceAmount = changingTo ? toAmount : fromAmount;
            let partialAmount = new BigNumber(fromWei(referenceAmount));
            if (changingTo) {
                partialAmount = partialAmount.multipliedBy(exchangeRate.price);
            } else {
                partialAmount = partialAmount.dividedBy(exchangeRate.price);
            }
            const newAmount = toWei(partialAmount.decimalPlaces(18).toString());
            if (changingTo && newAmount !== fromAmount) {
                setFromAmount(newAmount);
            } else if (!changingTo && newAmount !== toAmount) {
                setToAmount(newAmount);
            }
        }
    }, [
        compatibleMarkets,
        dispatch,
        exchangeRate,
        changingTo,
        fromToken,
        fromAmount,
        toToken,
        toAmount,
    ]);

    const handleFromTokenChange = useCallback((token) => {
        setFromToken(token);
    }, []);

    const handleFromAmountChange = useCallback((amount) => {
        setChangingTo(false);
        setFromAmount(amount);
    }, []);

    const handleToTokenChange = useCallback((token) => {
        setToToken(token);
    }, []);

    const handleToAmountChange = useCallback((amount) => {
        setChangingTo(true);
        setToAmount(amount);
    }, []);

    return (
        <Flex flexDirection="column">
            <BackgroundFlex flexDirection="column" mb={4}>
                <Box>
                    <TokenSpecifier
                        variant="from"
                        amount={fromAmount}
                        token={fromToken}
                        onAmountChange={handleFromAmountChange}
                        onTokenChange={handleFromTokenChange}
                        supportedTokens={supportedFromTokens}
                        balances={balances}
                        loadingSupportedTokens={loadingSupportedTokens}
                    />
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={36}
                >
                    <ArrowIcon icon={faArrowDown} />
                </Box>
                <Box mb={3}>
                    <TokenSpecifier
                        variant="to"
                        amount={toAmount}
                        token={toToken}
                        onAmountChange={handleToAmountChange}
                        onTokenChange={handleToTokenChange}
                        supportedTokens={filteredToTokens}
                        balances={balances}
                        loadingSupportedTokens={loadingSupportedTokens}
                    />
                </Box>
                <Flex justifyContent="space-between" alignItems="center" px={2}>
                    <Box>
                        <FormattedMessage id="swapper.price" />
                    </Box>
                    <Box>
                        {loadingExchangeRate ? (
                            <Spinner size={16} />
                        ) : exchangeRate && exchangeRate.price ? (
                            `${exchangeRate.price} ${fromToken.symbol}`
                        ) : (
                            "-"
                        )}
                    </Box>
                </Flex>
            </BackgroundFlex>
            <Box display="flex" justifyContent="center" mb={4}>
                <Button
                    faIcon={loggedIn ? faExchangeAlt : faLockOpen}
                    size="large"
                    disabled={
                        loggedIn &&
                        (!fromToken ||
                            !fromAmount === "0" ||
                            !toToken ||
                            !toAmount === "0")
                    }
                    /* TODO: add proper onClick when actually swapping */
                    onClick={loggedIn ? () => {} : onConnectWalletClick}
                >
                    <FormattedMessage
                        id={`swapper.action.${loggedIn ? "swap" : "connect"}`}
                    />
                </Button>
            </Box>
        </Flex>
    );
};

Swapper.propTypes = {
    onConnectWalletClick: PropTypes.func.isRequired,
};

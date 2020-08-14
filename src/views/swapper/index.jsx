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

    const [fromSpecification, setFromSpecification] = useState({
        amount: "0",
        token: null,
    });
    const [toSpecification, setToSpecification] = useState({
        amount: "0",
        token: null,
    });
    const [filteredToTokens, setFilteredToTokens] = useState([]);
    const [compatibleMarkets, setCompatibleMarkets] = useState([]);

    // set ether as the default "from" token
    useEffect(() => {
        if (
            supportedTokens &&
            supportedTokens.length > 0 &&
            !fromSpecification.token
        ) {
            setFromSpecification({
                ...fromSpecification,
                token: supportedTokens.find((token) => token.symbol === "ETH"),
            });
        }
    }, [fromSpecification, supportedTokens]);

    // on "from" token change, find out the compatible markets
    useEffect(() => {
        if (
            supportedMarkets &&
            supportedMarkets.length > 0 &&
            fromSpecification.token
        ) {
            setCompatibleMarkets(
                supportedMarkets.filter(
                    (market) =>
                        market.quoteTokenId === fromSpecification.token.tokenId
                )
            );
        }
    }, [fromSpecification.token, supportedMarkets]);

    // on "from" token change, we need to find the compatible "to" tokens based on available markets.
    // Plus, we reset the currently selected "to" token if it's not compatible with the current "from" one.
    useEffect(() => {
        if (
            supportedMarkets &&
            supportedMarkets.length > 0 &&
            fromSpecification.token
        ) {
            const filteredToTokens = supportedToTokens.filter((token) =>
                compatibleMarkets.find(
                    (market) => market.baseTokenId === token.tokenId
                )
            );
            if (
                filteredToTokens &&
                filteredToTokens.length > 0 &&
                toSpecification &&
                toSpecification.token &&
                !filteredToTokens.find(
                    (token) => token.tokenId === toSpecification.token.tokenId
                )
            ) {
                setToSpecification({ amount: "0", token: filteredToTokens[0] });
            }
            setFilteredToTokens(filteredToTokens);
        }
    }, [
        compatibleMarkets,
        fromSpecification,
        supportedMarkets,
        supportedToTokens,
        toSpecification,
    ]);

    // on valid "from" and "to" tokens setting, we need to find their current exchange rate
    useEffect(() => {
        if (
            supportedTokens &&
            supportedTokens.length > 0 &&
            fromSpecification.token &&
            toSpecification.token &&
            !!compatibleMarkets.find(
                (market) =>
                    market.baseTokenId === toSpecification.token.tokenId &&
                    market.quoteTokenId === fromSpecification.token.tokenId
            )
        ) {
            dispatch(
                getExchangeRate(
                    fromSpecification,
                    toSpecification,
                    supportedTokens
                )
            );
        }
    }, [
        compatibleMarkets,
        dispatch,
        fromSpecification,
        supportedTokens,
        toSpecification,
    ]);

    // when the exchange rate is fetched, we need to calculate the expected
    // token amount to receive based on it
    useEffect(() => {
        if (
            exchangeRate &&
            exchangeRate.price &&
            fromSpecification.token &&
            fromSpecification.amount &&
            fromSpecification.amount !== "0" &&
            toSpecification.token
        ) {
            const toAmount = toWei(
                new BigNumber(fromWei(fromSpecification.amount))
                    .dividedBy(exchangeRate.price)
                    .decimalPlaces(18)
                    .toString()
            );
            if (toAmount !== toSpecification.amount) {
                setToSpecification({
                    ...toSpecification,
                    amount: toAmount,
                });
            }
        }
    }, [
        compatibleMarkets,
        dispatch,
        fromSpecification,
        exchangeRate,
        toSpecification,
    ]);

    const handleFromChange = useCallback((newSpecification) => {
        setFromSpecification(newSpecification);
    }, []);

    const handleToChange = useCallback((newSpecification) => {
        setToSpecification(newSpecification);
    }, []);

    return (
        <Flex flexDirection="column">
            <BackgroundFlex flexDirection="column" mb={4}>
                <Box>
                    <TokenSpecifier
                        variant="from"
                        specification={fromSpecification}
                        onChange={handleFromChange}
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
                        specification={toSpecification}
                        onChange={handleToChange}
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
                            `${exchangeRate.price} ${fromSpecification.token.symbol}`
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
                        (!fromSpecification ||
                            fromSpecification.token ||
                            fromSpecification.amount === "0" ||
                            !toSpecification ||
                            toSpecification.token ||
                            toSpecification.amount === "0")
                    }
                    /* TODO: add proper onClick when actually swapping */
                    onClick={loggedIn ? () => {} : onConnectWalletClick}
                >
                    <FormattedMessage
                        id={`swapper.action.${loggedIn ? "swap" : "connect"}`}
                    />
                </Button>
            </Box>
            <Box display="flex" justifyContent="center" textAlign="center">
                <ErrorMessage>
                    <FormattedMessage id="swapper.login.warning" />
                </ErrorMessage>
            </Box>
        </Flex>
    );
};

Swapper.propTypes = {
    onConnectWalletClick: PropTypes.func.isRequired,
};

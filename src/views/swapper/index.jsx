import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { BackgroundFlex, ArrowIcon, SlippageText } from "./styled";
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
import { getSwapData } from "../../actions/loopring";
import BigNumber from "bignumber.js";
import { fromWei, toWei } from "web3-utils";
import { Spinner } from "../../components/spinner";
import { useDebouncedCallback } from "use-debounce";

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
        swapData,
        loadingSwapData,
    } = useSelector((state) => ({
        supportedTokens: state.loopring.supportedTokens.data.aggregated,
        loadingSupportedTokens: !!state.loopring.supportedTokens.loadings,
        supportedFromTokens: state.loopring.supportedTokens.data.fromTokens,
        supportedToTokens: state.loopring.supportedTokens.data.toTokens,
        supportedMarkets: state.loopring.supportedMarkets.data,
        balances: state.loopring.balances.data,
        loggedIn: !!state.loopring.account,
        swapData: state.loopring.swap.data,
        loadingSwapData: !!state.loopring.swap.loadings,
    }));

    const [fromToken, setFromToken] = useState(null);
    const [fromAmount, setFromAmount] = useState("0");
    const [toToken, setToToken] = useState(null);
    const [toAmount, setToAmount] = useState("0");
    const [filteredToTokens, setFilteredToTokens] = useState([]);
    const [compatibleMarkets, setCompatibleMarkets] = useState([]);
    const [changingTo, setChangingTo] = useState(false);

    const [debouncedGetSwapData] = useDebouncedCallback(
        (fromToken, toToken, fromAmount, supportedTokens) => {
            dispatch(
                getSwapData(fromToken, toToken, fromAmount, supportedTokens)
            );
        },
        500
    );

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
            fromAmount &&
            toToken &&
            !!compatibleMarkets.find(
                (market) =>
                    market.baseTokenId === toToken.tokenId &&
                    market.quoteTokenId === fromToken.tokenId
            )
        ) {
            debouncedGetSwapData(
                fromToken,
                toToken,
                fromAmount,
                supportedTokens
            );
        }
    }, [
        compatibleMarkets,
        debouncedGetSwapData,
        dispatch,
        fromAmount,
        fromToken,
        supportedTokens,
        toAmount,
        toToken,
    ]);

    // when the exchange rate is fetched, we need to calculate the expected
    // token amount to receive based on it
    useEffect(() => {
        if (
            swapData &&
            swapData.averageFillPrice &&
            fromToken &&
            fromAmount &&
            toToken
        ) {
            const referenceAmount = changingTo ? toAmount : fromAmount;
            let partialAmount = new BigNumber(fromWei(referenceAmount));
            if (changingTo) {
                partialAmount = partialAmount.multipliedBy(
                    swapData.averageFillPrice
                );
            } else {
                partialAmount = partialAmount.dividedBy(
                    swapData.averageFillPrice
                );
            }
            const newAmount = toWei(partialAmount.decimalPlaces(18).toString());
            if (changingTo && newAmount !== fromAmount) {
                // if the updated to amount is more than the maximum one based on
                // the order book, the maximum possible value is set
                if (
                    swapData.maximumAmount &&
                    new BigNumber(newAmount)
                        .dividedBy(swapData.averageFillPrice)
                        .isGreaterThan(swapData.maximumAmount)
                ) {
                    // FIXME: this could cause problems if a given market is particularily illuquid.
                    // In some cases from amount will not have a significant decimal in the first 5 spots,
                    // and since the UI doesn't support this, chances are the user will see 0 in the from
                    // amount from the app, while the internal component state has a minuscule but present
                    // from amount. It should only happen in extreme cases.
                    setFromAmount(
                        swapData.maximumAmount
                            .multipliedBy(swapData.averageFillPrice)
                            .decimalPlaces(0)
                            .toFixed()
                    );
                } else {
                    setFromAmount(newAmount);
                }
            } else if (!changingTo && newAmount !== toAmount) {
                // If the new from amount would bring, based on the current average
                // fill price, the to token amount to be bigger than the maximum allowed
                // quantity, the from amount is adjusted accordingly
                if (
                    swapData.maximumAmount &&
                    swapData.maximumAmount.isLessThan(newAmount)
                ) {
                    // FIXME: this could cause problems if a given market is particularily illuquid.
                    // In some cases from amount will not have a significant decimal in the first 5 spots,
                    // and since the UI doesn't support this, chances are the user will see 0 in the from
                    // amount from the app, while the internal component state has a minuscule but present
                    // from amount. It should only happen in extreme cases.
                    setFromAmount(
                        swapData.maximumAmount
                            .multipliedBy(swapData.averageFillPrice)
                            .decimalPlaces(0)
                            .toFixed()
                    );
                    setToAmount(swapData.maximumAmount.toFixed());
                } else {
                    setToAmount(newAmount);
                }
            }
        }
    }, [
        compatibleMarkets,
        dispatch,
        changingTo,
        fromToken,
        fromAmount,
        toToken,
        toAmount,
        swapData,
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
                <Box mb="12px">
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
                <Flex
                    mb="8px"
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                >
                    <Box>
                        <FormattedMessage id="swapper.price" />
                    </Box>
                    <Box>
                        {loadingSwapData ? (
                            <Spinner size={16} />
                        ) : swapData && swapData.averageFillPrice ? (
                            `${swapData.averageFillPrice
                                .decimalPlaces(4)
                                .toString()} ${fromToken.symbol}`
                        ) : (
                            "-"
                        )}
                    </Box>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center" px={2}>
                    <Box>
                        <FormattedMessage id="swapper.slippage" />
                    </Box>
                    <Box>
                        {loadingSwapData ? (
                            <Spinner size={16} />
                        ) : swapData && swapData.slippagePercentage ? (
                            <SlippageText>
                                {swapData.slippagePercentage
                                    .decimalPlaces(2)
                                    .toString()}
                                %
                            </SlippageText>
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

import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import {
    BackgroundFlex,
    ArrowIcon,
    SlippageText,
    FeeTextBox,
    PointableBox,
} from "./styled";
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
import { getSwapData, postSwap, getUserBalances } from "../../actions/loopring";
import BigNumber from "bignumber.js";
import { fromWei, toWei } from "web3-utils";
import { Spinner } from "../../components/spinner";
import { useDebouncedCallback } from "use-debounce";

export const Swapper = ({ onConnectWalletClick }) => {
    const dispatch = useDispatch();

    const {
        loopringAccount,
        loopringExchange,
        loopringWallet,
        supportedTokens,
        loadingSupportedTokens,
        loadingBalances,
        supportedMarkets,
        balances,
        loggedIn,
        swapData,
        loadingSwapData,
        loadingSwapSubmission,
    } = useSelector((state) => ({
        loopringAccount: state.loopring.account,
        loopringExchange: state.loopring.exchange,
        loopringWallet: state.loopring.wallet,
        supportedTokens: state.loopring.supportedTokens.data,
        loadingSupportedTokens: !!state.loopring.supportedTokens.loadings,
        loadingBalances: !!state.loopring.balances.loadings,
        supportedMarkets: state.loopring.supportedMarkets.data,
        balances: state.loopring.balances.data,
        loggedIn: !!state.loopring.account,
        swapData: state.loopring.swap.data,
        loadingSwapData: !!state.loopring.swap.loadings,
        loadingSwapSubmission: !!state.loopring.swapSubmission.loadings,
    }));

    const [fromToken, setFromToken] = useState(null);
    const [fromAmount, setFromAmount] = useState("0");
    const [toToken, setToToken] = useState(null);
    const [toAmount, setToAmount] = useState("0");
    const [filteredToTokens, setFilteredToTokens] = useState([]);
    const [compatibleMarkets, setCompatibleMarkets] = useState([]);
    const [changingToAmount, setChangingToAmount] = useState(false);
    const [changingFromAmount, setChangingFromAmount] = useState(false);
    const [changingToToken, setChangingToToken] = useState(false);
    const [changingFromToken, setChangingFromToken] = useState(false);
    const [selling, setSelling] = useState(false);

    const [debouncedGetSwapData] = useDebouncedCallback(
        (fromToken, toToken, fromAmount, supportedTokens, selling) => {
            dispatch(
                getSwapData(
                    fromToken,
                    toToken,
                    fromAmount,
                    supportedTokens,
                    selling
                )
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
                    (market) =>
                        market.quoteTokenId === fromToken.tokenId ||
                        market.baseTokenId === fromToken.tokenId
                )
            );
        }
    }, [fromToken, supportedMarkets]);

    // on "from" token change, we need to find the compatible "to" tokens based on available markets.
    // Plus, we reset the currently selected "to" token if it's not compatible with the current "from" one.
    useEffect(() => {
        if (supportedMarkets && supportedMarkets.length > 0 && fromToken) {
            const filteredToTokens = supportedTokens.filter(
                (token) =>
                    token.tokenId !== fromToken.tokenId &&
                    compatibleMarkets.find(
                        (market) =>
                            market.baseTokenId === token.tokenId ||
                            market.quoteTokenId === token.tokenId
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
        supportedTokens,
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
            // when the exchange rate is used to calculate the expected to or from token amount,
            // and that is enforced on the component's state, this effect is invoked again and again
            // until the currently fetched exchange rate is the same as the previous.
            // In particularly traded markets, where the order book changes often, this produces an
            // annoying flickering effect. We avoid it by calculating from and to amounts only if
            // an actual user interacted with the form (NOT when the app updates the to and
            // from amounts after swap-details-related calculations)
            (changingFromAmount ||
                changingToAmount ||
                changingFromToken ||
                changingToToken)
        ) {
            const tradedMarket = compatibleMarkets.find(
                (market) =>
                    (market.baseTokenId === toToken.tokenId &&
                        market.quoteTokenId === fromToken.tokenId) ||
                    (market.baseTokenId === fromToken.tokenId &&
                        market.quoteTokenId === toToken.tokenId)
            );
            if (!tradedMarket) {
                return;
            }
            debouncedGetSwapData(
                supportedTokens.find(
                    (token) => token.tokenId === tradedMarket.baseTokenId
                ),
                supportedTokens.find(
                    (token) => token.tokenId === tradedMarket.quoteTokenId
                ),
                fromAmount,
                supportedTokens,
                selling
            );
        }
    }, [
        changingFromAmount,
        changingFromToken,
        changingToAmount,
        changingToToken,
        compatibleMarkets,
        debouncedGetSwapData,
        fromAmount,
        fromToken,
        selling,
        supportedTokens,
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
            const referenceAmount = changingToAmount ? toAmount : fromAmount;
            let partialAmount = new BigNumber(fromWei(referenceAmount));
            if (changingToAmount) {
                partialAmount = selling
                    ? partialAmount.dividedBy(swapData.averageFillPrice)
                    : partialAmount.multipliedBy(swapData.averageFillPrice);
            } else {
                partialAmount = selling
                    ? partialAmount.multipliedBy(swapData.averageFillPrice)
                    : partialAmount.dividedBy(swapData.averageFillPrice);
            }
            const newAmount = toWei(partialAmount.decimalPlaces(18).toString());
            if (changingToAmount && newAmount !== fromAmount) {
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
                    let adjustedFromAmount = swapData.maximumAmount;
                    if (selling) {
                        adjustedFromAmount = adjustedFromAmount.dividedBy(
                            swapData.averageFillPrice
                        );
                    } else {
                        adjustedFromAmount = adjustedFromAmount.multipliedBy(
                            swapData.averageFillPrice
                        );
                    }
                    setFromAmount(
                        adjustedFromAmount.decimalPlaces(0).toFixed()
                    );
                } else {
                    setFromAmount(newAmount);
                }
            } else if (!changingToAmount && newAmount !== toAmount) {
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
                    let adjustedFromAmount = swapData.maximumAmount;
                    if (selling) {
                        adjustedFromAmount = adjustedFromAmount.dividedBy(
                            swapData.averageFillPrice
                        );
                    } else {
                        adjustedFromAmount = adjustedFromAmount.multipliedBy(
                            swapData.averageFillPrice
                        );
                    }
                    setFromAmount(
                        adjustedFromAmount.decimalPlaces(0).toFixed()
                    );
                    setToAmount(swapData.maximumAmount.toFixed());
                } else {
                    setToAmount(newAmount);
                }
            }
            setChangingToAmount(false);
            setChangingFromAmount(false);
            setChangingToToken(false);
            setChangingFromToken(false);
        }
    }, [
        changingToAmount,
        fromAmount,
        fromToken,
        selling,
        swapData,
        toAmount,
        toToken,
    ]);

    // on "from" or "to" token changes, we need to determine if the user is buying or selling a given market.
    // We do this by checking if the corresponding market has the "from" token as a base or quote currency.
    // If the "from" token is a quote currency, the user is buying, and vice-versa.
    useEffect(() => {
        if (fromToken && toToken) {
            setSelling(
                !!compatibleMarkets.find(
                    (market) =>
                        market.baseTokenId === fromToken.tokenId &&
                        market.quoteTokenId === toToken.tokenId
                )
            );
        }
    }, [compatibleMarkets, fromToken, toToken]);

    const handleFromTokenChange = useCallback((token) => {
        setChangingToToken(false);
        setChangingFromToken(true);
        setFromToken(token);
    }, []);

    const handleFromAmountChange = useCallback((amount) => {
        setChangingToAmount(false);
        setChangingFromAmount(true);
        setFromAmount(amount);
    }, []);

    const handleToTokenChange = useCallback((token) => {
        setChangingToToken(true);
        setChangingFromToken(false);
        setToToken(token);
    }, []);

    const handleToAmountChange = useCallback((amount) => {
        setChangingToAmount(true);
        setChangingFromAmount(false);
        setToAmount(amount);
    }, []);

    const handleSwap = useCallback(() => {
        dispatch(
            postSwap(
                loopringAccount,
                loopringWallet,
                loopringExchange,
                fromToken,
                fromAmount,
                toToken,
                toAmount,
                supportedTokens,
                selling
            )
        );
    }, [
        dispatch,
        fromAmount,
        fromToken,
        loopringAccount,
        loopringExchange,
        loopringWallet,
        selling,
        supportedTokens,
        toAmount,
        toToken,
    ]);

    const handleBalancesRefresh = useCallback(() => {
        if (loggedIn) {
            dispatch(
                getUserBalances(
                    loopringAccount,
                    loopringWallet,
                    supportedTokens
                )
            );
        }
    }, [dispatch, loggedIn, loopringAccount, loopringWallet, supportedTokens]);

    const handleSwitchSwapAttributes = useCallback(() => {
        setFromToken(toToken);
        setToToken(fromToken);
    }, [fromToken, toToken]);

    return (
        <Flex flexDirection="column">
            <BackgroundFlex flexDirection="column" alignItems="center" mb={4}>
                <Box>
                    <TokenSpecifier
                        variant="from"
                        amount={fromAmount}
                        token={fromToken}
                        onAmountChange={handleFromAmountChange}
                        onBalancesRefresh={handleBalancesRefresh}
                        onTokenChange={handleFromTokenChange}
                        supportedTokens={supportedTokens}
                        balances={balances}
                        loadingSupportedTokens={loadingSupportedTokens}
                        loadingBalances={loadingBalances}
                        loggedIn={loggedIn}
                    />
                </Box>
                <PointableBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={36}
                    onClick={handleSwitchSwapAttributes}
                    p={2}
                >
                    <ArrowIcon icon={faArrowDown} />
                </PointableBox>
                <Box mb="12px">
                    <TokenSpecifier
                        variant="to"
                        amount={toAmount}
                        token={toToken}
                        onAmountChange={handleToAmountChange}
                        onBalancesRefresh={handleBalancesRefresh}
                        onTokenChange={handleToTokenChange}
                        supportedTokens={filteredToTokens}
                        balances={balances}
                        loadingSupportedTokens={loadingSupportedTokens}
                        loadingBalances={loadingBalances}
                        loggedIn={loggedIn}
                    />
                </Box>
                <Flex
                    mb="8px"
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                    width="100%"
                >
                    <Box>
                        <FormattedMessage id="swapper.price" />
                    </Box>
                    <Box>
                        {loadingSwapData ? (
                            <Spinner size={12} />
                        ) : swapData && swapData.averageFillPrice ? (
                            `${(selling
                                ? swapData.averageFillPrice
                                : new BigNumber("1").dividedBy(
                                      swapData.averageFillPrice
                                  )
                            )
                                .decimalPlaces(4)
                                .toString()} ${toToken.symbol}`
                        ) : (
                            "-"
                        )}
                    </Box>
                </Flex>
                <Flex
                    mb="8px"
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                    width="100%"
                >
                    <Box>
                        <FormattedMessage id="swapper.slippage" />
                    </Box>
                    <Box>
                        {loadingSwapData ? (
                            <Spinner size={12} />
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
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                    width="100%"
                >
                    <Box>
                        <FormattedMessage id="swapper.fee" />
                    </Box>
                    {/* TODO: this should be dynamically fetched */}
                    <FeeTextBox>0</FeeTextBox>
                </Flex>
            </BackgroundFlex>
            <Box display="flex" justifyContent="center" mb={4}>
                <Button
                    faIcon={loggedIn ? faExchangeAlt : faLockOpen}
                    size="large"
                    loading={loggedIn && loadingSwapSubmission}
                    disabled={
                        loggedIn &&
                        (!fromToken ||
                            !fromAmount ||
                            fromAmount === "0" ||
                            !toToken ||
                            !toAmount ||
                            toAmount === "0")
                    }
                    onClick={loggedIn ? handleSwap : onConnectWalletClick}
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

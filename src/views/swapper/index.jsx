import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import {
    BackgroundFlex,
    ArrowIcon,
    SlippageText,
    PointableBox,
    ErrorTextBox,
    PriceFlipIcon,
} from "./styled";
import { TokenSpecifier } from "../../components/token-specifier";
import { useState } from "react";
import {
    faArrowDown,
    faExchangeAlt,
    faLockOpen,
    faExclamationTriangle,
    faRandom,
} from "@fortawesome/free-solid-svg-icons";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "../../components/button";
import { useSelector, useDispatch } from "react-redux";
import {
    getSwapData,
    postSwap,
    getUserBalances,
    resetSwapData,
} from "../../actions/loopring";
import BigNumber from "bignumber.js";
import { Spinner } from "../../components/spinner";
import { useDebouncedCallback } from "use-debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { weiToEther } from "../../utils";

export const Swapper = ({ onConnectWalletClick }) => {
    const { formatNumber } = useIntl();
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
    const [fromAmount, setFromAmount] = useState("");
    const [liquidityError, setLiquidityError] = useState(null);
    const [balanceError, setBalanceError] = useState(null);
    const [lessThanMinimumOrderError, setLessThanMinimumOrderError] = useState(
        null
    );
    const [moreThanMaximumOrderError, setMoreThanMaximumOrderError] = useState(
        null
    );
    const [toToken, setToToken] = useState(null);
    const [toAmount, setToAmount] = useState("");
    const [feeAmount, setFeeAmount] = useState("");
    const [filteredToTokens, setFilteredToTokens] = useState([]);
    const [compatibleMarkets, setCompatibleMarkets] = useState([]);
    const [changingToAmount, setChangingToAmount] = useState(false);
    const [changingFromAmount, setChangingFromAmount] = useState(false);
    const [selling, setSelling] = useState(false);
    const [flippedPriceNotation, setFlippedPriceNotation] = useState(false);

    const [debouncedGetSwapData] = useDebouncedCallback(
        (
            wallet,
            account,
            fromToken,
            toToken,
            fromAmount,
            supportedTokens,
            selling
        ) => {
            dispatch(
                getSwapData(
                    wallet,
                    account,
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

    useEffect(() => {
        if (loggedIn) {
            setFromAmount("");
            setToAmount("");
            dispatch(resetSwapData());
            setLiquidityError(false);
            setBalanceError(false);
            setLessThanMinimumOrderError(false);
            setMoreThanMaximumOrderError(false);
        }
    }, [dispatch, loggedIn]);

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
                setToAmount("");
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
            toToken &&
            !liquidityError &&
            // when the exchange rate is used to calculate the expected to or from token amount,
            // and that is enforced on the component's state, this effect is invoked again and again
            // until the currently fetched exchange rate is the same as the previous.
            // In particularly traded markets, where the order book changes often, this produces an
            // annoying flickering effect. We avoid it by calculating from and to amounts only if
            // an actual user interacted with the form (NOT when the app updates the to and
            // from amounts after swap-details-related calculations)
            ((!changingFromAmount &&
                !changingToAmount &&
                fromAmount &&
                toAmount) ||
                (changingFromAmount && fromAmount) ||
                (changingToAmount && toAmount))
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
                loopringWallet,
                loopringAccount,
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
        loopringWallet,
        loopringAccount,
        changingFromAmount,
        changingToAmount,
        compatibleMarkets,
        debouncedGetSwapData,
        liquidityError,
        fromAmount,
        fromToken,
        selling,
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
            toToken &&
            ((!changingFromAmount &&
                !changingToAmount &&
                fromAmount &&
                toAmount) ||
                (changingFromAmount && fromAmount) ||
                (changingToAmount && toAmount))
        ) {
            const referenceAmount = changingToAmount ? toAmount : fromAmount;
            let partialAmount = new BigNumber(referenceAmount);
            if (changingToAmount) {
                partialAmount = selling
                    ? partialAmount.dividedBy(swapData.averageFillPrice)
                    : partialAmount.multipliedBy(swapData.averageFillPrice);
            } else {
                partialAmount = selling
                    ? partialAmount.multipliedBy(swapData.averageFillPrice)
                    : partialAmount.dividedBy(swapData.averageFillPrice);
            }
            const newAmount = partialAmount.toFixed();
            let newFromAmount = fromAmount;
            let newToAmount = toAmount;
            if (changingToAmount && newAmount !== fromAmount) {
                // if the updated to amount is more than the maximum one based on
                // the order book, the maximum possible value is set
                newFromAmount = newAmount;
                setLiquidityError(
                    !!(
                        swapData.maximumAmount &&
                        new BigNumber(newAmount)
                            .dividedBy(swapData.averageFillPrice)
                            .isGreaterThan(swapData.maximumAmount)
                    )
                );
            } else if (!changingToAmount && newAmount !== toAmount) {
                // If the new from amount would bring, based on the current average
                // fill price, the to token amount to be bigger than the maximum allowed
                // quantity, the from amount is adjusted accordingly
                newToAmount = newAmount;
                setLiquidityError(
                    !!(
                        swapData.maximumAmount &&
                        swapData.maximumAmount.isLessThan(newAmount)
                    )
                );
            }
            setFromAmount(newFromAmount);
            const feeAmount = new BigNumber(newToAmount).multipliedBy(
                swapData.feePercentage
            );
            setToAmount(new BigNumber(newToAmount).minus(feeAmount).toFixed());
            setFeeAmount(feeAmount);
        }
    }, [
        changingFromAmount,
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

    useEffect(() => {
        if (
            (!fromAmount && toAmount && changingFromAmount) ||
            (!toAmount && fromAmount && changingToAmount)
        ) {
            setToAmount("");
            dispatch(resetSwapData());
            setLiquidityError(false);
            setBalanceError(false);
            setLessThanMinimumOrderError(false);
            setMoreThanMaximumOrderError(false);
        }
    }, [changingFromAmount, dispatch, changingToAmount, fromAmount, toAmount]);

    useEffect(() => {
        if (!fromToken || !toToken) {
            return;
        }
        const wrappedBalance = balances.find(
            (balance) => balance.id === fromToken.tokenId
        );
        const tokenMaximumExchangeBalance =
            wrappedBalance && wrappedBalance.balance;
        const bigNumberFromAmount = new BigNumber(fromAmount);
        const bigNumberToAmount = new BigNumber(toAmount);
        setBalanceError(
            !!(
                tokenMaximumExchangeBalance &&
                bigNumberFromAmount.isGreaterThan(tokenMaximumExchangeBalance)
            )
        );
        const fromTokenMinimumTradeVolume = weiToEther(
            new BigNumber(fromToken.minOrderAmount),
            fromToken.decimals
        );
        const toTokenMinimumTradeVolume = weiToEther(
            new BigNumber(toToken.minOrderAmount),
            toToken.decimals
        );
        setLessThanMinimumOrderError(
            !!(
                !bigNumberFromAmount.isZero() &&
                !bigNumberToAmount.isZero() &&
                (bigNumberFromAmount.isLessThan(fromTokenMinimumTradeVolume) ||
                    bigNumberToAmount.isLessThan(toTokenMinimumTradeVolume))
            )
        );
        const fromTokenMaximumTradeVolume = weiToEther(
            new BigNumber(fromToken.maxOrderAmount),
            fromToken.decimals
        );
        const toTokenMaximumTradeVolume = weiToEther(
            new BigNumber(toToken.maxOrderAmount),
            toToken.decimals
        );
        setMoreThanMaximumOrderError(
            !!(
                !bigNumberFromAmount.isZero() &&
                !bigNumberToAmount.isZero() &&
                (bigNumberFromAmount.isGreaterThan(
                    fromTokenMaximumTradeVolume
                ) ||
                    bigNumberToAmount.isGreaterThan(toTokenMaximumTradeVolume))
            )
        );
    }, [balances, fromAmount, fromToken, toAmount, toToken]);

    const handleFromAmountChange = useCallback((amount) => {
        setChangingToAmount(false);
        setChangingFromAmount(true);
        setFromAmount(amount);
    }, []);

    const handleToAmountChange = useCallback((weiAmount) => {
        setChangingToAmount(true);
        setChangingFromAmount(false);
        setToAmount(weiAmount);
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
        if (
            loggedIn &&
            loopringAccount &&
            loopringWallet &&
            supportedTokens &&
            supportedTokens.length > 0
        ) {
            dispatch(
                getUserBalances(
                    loopringAccount,
                    loopringWallet,
                    supportedTokens
                )
            );
        }
    }, [dispatch, loggedIn, loopringAccount, loopringWallet, supportedTokens]);

    const handleAssetsInversion = useCallback(() => {
        if (fromToken && toToken) {
            setFromAmount("");
            setToAmount("");
            setFromToken(toToken);
            setToToken(fromToken);
            setLiquidityError(false);
            setBalanceError(false);
            setLessThanMinimumOrderError(false);
            setMoreThanMaximumOrderError(false);
            dispatch(resetSwapData());
        }
    }, [fromToken, toToken, dispatch]);

    const getErrorCause = () => {
        if (moreThanMaximumOrderError) {
            return "maximum";
        }
        if (liquidityError) {
            return "liquidity";
        }
        if (balanceError) {
            return "balance";
        }
        if (lessThanMinimumOrderError) {
            return "minimum";
        }
        return null;
    };

    const getPriceNotation = () => {
        let price;
        const priceFromToken = flippedPriceNotation ? fromToken : toToken;
        const priceToToken = flippedPriceNotation ? toToken : fromToken;
        if (selling) {
            price = flippedPriceNotation
                ? new BigNumber("1").dividedBy(swapData.averageFillPrice)
                : swapData.averageFillPrice;
        } else {
            price = flippedPriceNotation
                ? swapData.averageFillPrice
                : new BigNumber("1").dividedBy(swapData.averageFillPrice);
        }
        return `${formatNumber(price, {
            style: "decimal",
            maximumSignificantDigits: 4,
        })} ${priceFromToken.symbol} per ${priceToToken.symbol}`;
    };

    const handlePriceFlip = useCallback(() => {
        setFlippedPriceNotation(!flippedPriceNotation);
    }, [flippedPriceNotation]);

    return (
        <Flex flexDirection="column">
            <BackgroundFlex flexDirection="column" alignItems="center" mb={4}>
                <Box>
                    <TokenSpecifier
                        variant="from"
                        amount={fromAmount}
                        token={fromToken}
                        changing={changingFromAmount}
                        onAmountChange={handleFromAmountChange}
                        onBalancesRefresh={handleBalancesRefresh}
                        onTokenChange={setFromToken}
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
                    p={2}
                    onClick={handleAssetsInversion}
                >
                    <ArrowIcon icon={faArrowDown} />
                </PointableBox>
                <Box mb="12px">
                    <TokenSpecifier
                        variant="to"
                        amount={toAmount}
                        token={toToken}
                        changing={changingToAmount}
                        onAmountChange={handleToAmountChange}
                        onBalancesRefresh={handleBalancesRefresh}
                        onTokenChange={setToToken}
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
                    height="12px"
                    width="100%"
                >
                    {(liquidityError ||
                        balanceError ||
                        lessThanMinimumOrderError ||
                        moreThanMaximumOrderError) && (
                        <>
                            <ErrorTextBox>
                                <FormattedMessage
                                    id={`swapper.error.amount.${getErrorCause()}`}
                                />
                            </ErrorTextBox>
                            <ErrorTextBox>
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                            </ErrorTextBox>
                        </>
                    )}
                </Flex>
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
                            <Flex>
                                <Box mr="4px">{getPriceNotation()}</Box>
                                <PointableBox onClick={handlePriceFlip}>
                                    <PriceFlipIcon icon={faRandom} />
                                </PointableBox>
                            </Flex>
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
                                {formatNumber(swapData.slippagePercentage, {
                                    style: "decimal",
                                    maximumSignificantDigits: 4,
                                })}
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
                    <Box>
                        {feeAmount && feeAmount.isGreaterThan("0")
                            ? `${formatNumber(feeAmount, {
                                  style: "decimal",
                                  maximumSignificantDigits: 4,
                              })} ${toToken.symbol}`
                            : "-"}
                    </Box>
                </Flex>
            </BackgroundFlex>
            <Box display="flex" justifyContent="center" mb={4}>
                <Button
                    faIcon={loggedIn ? faExchangeAlt : faLockOpen}
                    size="large"
                    loading={loggedIn && loadingSwapSubmission}
                    disabled={
                        loggedIn &&
                        (liquidityError ||
                            balanceError ||
                            lessThanMinimumOrderError ||
                            moreThanMaximumOrderError ||
                            !fromToken ||
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

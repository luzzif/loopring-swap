import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import BigNumber from "bignumber.js";
import { Flex, Box } from "reflexbox";
import { TokenIcon } from "../token-icon";
import {
    RowFlex,
    RootFlex,
    ContentFlex,
    ListFlex,
    SearchFlex,
    Input,
    EmptyIcon,
    EmptyTextBox,
    SecondaryTextBox,
    PointableBox,
    OPEN_CLOSE_ANIMATION_DURATION,
    PrimaryTextBox,
} from "./styled";
import { FullScreenOverlay } from "../full-screen-overlay";
import { FormattedMessage, useIntl } from "react-intl";
import {
    faTimes,
    faSearch,
    faExclamationTriangle,
    faSync,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { Spinner } from "../spinner";
import { formatBigNumber } from "../../utils";

export const TokenModal = ({
    loading,
    open,
    onClose,
    onRefresh,
    onChange,
    supportedTokens,
    balances,
    selected,
    loggedIn,
}) => {
    const { formatMessage } = useIntl();
    const contentRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [tokenDataset, setTokenDataset] = useState(supportedTokens);

    useEffect(() => {
        let dataset = supportedTokens;
        if (searchTerm) {
            dataset = dataset.filter(({ symbol, name, address }) => {
                const lowerCasedSearchTerm = searchTerm.toLowerCase();
                return (
                    symbol.toLowerCase().includes(lowerCasedSearchTerm) ||
                    name.toLowerCase().includes(lowerCasedSearchTerm) ||
                    address.toLowerCase().includes(lowerCasedSearchTerm)
                );
            });
        }
        if (balances) {
            dataset = dataset.sort(
                ({ address: firstAddress }, { address: secondAddress }) => {
                    const wrappedFirstTokenBalance = balances.find(
                        (balance) => balance.address === firstAddress
                    );
                    const wrappedSecondTokenBalance = balances.find(
                        (balance) => balance.address === secondAddress
                    );
                    const firstTokenBalance = new BigNumber(
                        wrappedFirstTokenBalance &&
                        wrappedFirstTokenBalance.balance
                            ? wrappedFirstTokenBalance.balance
                            : "0"
                    );
                    const secondTokenBalance = new BigNumber(
                        wrappedSecondTokenBalance &&
                        wrappedSecondTokenBalance.balance
                            ? wrappedSecondTokenBalance.balance
                            : "0"
                    );
                    return secondTokenBalance
                        .minus(firstTokenBalance)
                        .toNumber();
                }
            );
        }
        setTokenDataset(dataset);
    }, [searchTerm, supportedTokens, balances]);

    const getClickHandler = (token) => () => {
        onChange(token);
        handleLocalClose();
    };

    const handleLocalClose = useCallback(() => {
        onClose();
        setTimeout(() => {
            setTokenDataset(supportedTokens);
            setSearchTerm("");
        }, OPEN_CLOSE_ANIMATION_DURATION);
    }, [onClose, supportedTokens]);

    const handleLocalCloseOnOutsideClick = useCallback(
        (event) => {
            if (!contentRef.current.contains(event.target)) {
                handleLocalClose();
            }
        },
        [handleLocalClose]
    );

    const handleSearchTermChange = useCallback((event) => {
        setSearchTerm(event.target.value);
    }, []);

    return (
        <>
            <FullScreenOverlay open={open} />
            <RootFlex open={open} onClick={handleLocalCloseOnOutsideClick}>
                <ContentFlex
                    ref={contentRef}
                    width={["90%", "60%", "50%", "30%"]}
                    flexDirection="column"
                >
                    <SearchFlex mt="4px">
                        <Box mr={3}>
                            <FontAwesomeIcon icon={faSearch} />
                        </Box>
                        <Box flex={1}>
                            <Input
                                value={searchTerm}
                                onChange={handleSearchTermChange}
                                placeholder={formatMessage({
                                    id: "token.modal.searchbar.placeholder",
                                })}
                            />
                        </Box>
                        {loggedIn && (
                            <PointableBox ml={3} p={2} minWidth="auto">
                                <FontAwesomeIcon
                                    icon={faSync}
                                    onClick={onRefresh}
                                />
                            </PointableBox>
                        )}
                        <PointableBox ml={3} p={2}>
                            <FontAwesomeIcon
                                icon={faTimes}
                                onClick={handleLocalClose}
                            />
                        </PointableBox>
                    </SearchFlex>
                    {loading ? (
                        <Flex justifyContent="center" mb={4} mt={2}>
                            <Box>
                                <Spinner size={40} />
                            </Box>
                        </Flex>
                    ) : (
                        <>
                            <ListFlex
                                flexDirection="column"
                                px="12px"
                                py="12px"
                            >
                                {tokenDataset.length > 0 ? (
                                    tokenDataset.map((token) => {
                                        const { address, symbol, name } = token;
                                        const currentlySelected =
                                            selected === token;
                                        const wrappedBalance = balances.find(
                                            (balance) =>
                                                balance.address === address
                                        );
                                        const etherBalance = new BigNumber(
                                            wrappedBalance &&
                                            wrappedBalance.balance
                                                ? wrappedBalance.balance
                                                : "0"
                                        );
                                        return (
                                            <RowFlex
                                                key={address}
                                                alignItems="center"
                                                py={16}
                                                pl="12px"
                                                pr="16px"
                                                onClick={getClickHandler(token)}
                                                selected={currentlySelected}
                                            >
                                                <Box mr={3}>
                                                    <TokenIcon
                                                        address={address}
                                                        size={32}
                                                    />
                                                </Box>
                                                <Flex
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    flex={1}
                                                >
                                                    <Flex flexDirection="column">
                                                        <PrimaryTextBox
                                                            mb="2px"
                                                            selected={
                                                                currentlySelected
                                                            }
                                                        >
                                                            {symbol}
                                                        </PrimaryTextBox>
                                                        <SecondaryTextBox
                                                            selected={
                                                                currentlySelected
                                                            }
                                                        >
                                                            {name}
                                                        </SecondaryTextBox>
                                                    </Flex>
                                                    <Box>
                                                        {etherBalance.isZero()
                                                            ? "-"
                                                            : formatBigNumber(
                                                                  etherBalance
                                                              )}
                                                    </Box>
                                                </Flex>
                                            </RowFlex>
                                        );
                                    })
                                ) : (
                                    <Flex
                                        flexDirection="column"
                                        alignItems="center"
                                        my={3}
                                        px={3}
                                    >
                                        <Box mb={3}>
                                            <EmptyIcon
                                                icon={faExclamationTriangle}
                                            />
                                        </Box>
                                        <EmptyTextBox textAlign="center" mb={3}>
                                            <FormattedMessage id="token.modal.empty" />
                                        </EmptyTextBox>
                                    </Flex>
                                )}
                            </ListFlex>
                        </>
                    )}
                </ContentFlex>
            </RootFlex>
        </>
    );
};

TokenModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    balances: PropTypes.array.isRequired,
    selected: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
};

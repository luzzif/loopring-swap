import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { Flex, Box } from "reflexbox";
import { TokenIcon } from "../token-icon";
import {
    RowFlex,
    RootFlex,
    ContentFlex,
    ListFlex,
    CloseIcon,
    HeaderFlex,
    CloseBox,
} from "./styled";
import { FullScreenOverlay } from "../full-screen-overlay";
import { FormattedMessage } from "react-intl";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const {
    utils: { fromWei },
} = Web3;

export const TokenModal = ({
    loading,
    open,
    onClose,
    onChange,
    supportedTokens,
    balances,
    selected,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [tokenDataset, setTokenDataset] = useState(supportedTokens);
    const [balancesInEther, setBalancesInEther] = useState({});

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
        if (balancesInEther) {
            dataset = dataset.sort(
                ({ address: firstAddress }, { address: secondAddress }) => {
                    const firstTokenBalance = balancesInEther[firstAddress];
                    const secondTokenBalance = balancesInEther[secondAddress];
                    return firstTokenBalance && secondTokenBalance
                        ? secondTokenBalance.minus(firstTokenBalance).toNumber()
                        : 0;
                }
            );
        }
        setTokenDataset(dataset);
    }, [searchTerm, balancesInEther, supportedTokens]);

    useEffect(() => {
        if (!balances) {
            return;
        }
        const balancesInEther = Object.entries(balances).reduce(
            (balancesInEther, [address, balanceInWei]) => {
                balancesInEther[address] = new BigNumber(fromWei(balanceInWei));
                return balancesInEther;
            },
            {}
        );
        setBalancesInEther(balancesInEther);
    }, [balances]);

    const getClickHandler = (token) => () => {
        onChange(token);
        onClose();
    };

    const handleLocalClose = useCallback(() => {
        onClose();
        setTokenDataset(supportedTokens);
        setSearchTerm("");
    }, [onClose, supportedTokens]);

    return (
        <>
            <FullScreenOverlay open={open} />
            <RootFlex open={open} onClick={handleLocalClose}>
                <ContentFlex
                    width={["90%", "80%", "60%", "30%"]}
                    flexDirection="column"
                >
                    <HeaderFlex>
                        <FormattedMessage id="token.modal.header" />
                        <CloseBox ml={3} p={2}>
                            <FontAwesomeIcon icon={faTimes} onClick={onClose} />
                        </CloseBox>
                    </HeaderFlex>
                    <ListFlex flexDirection="column" py="8px" px="12px">
                        {tokenDataset.length > 0
                            ? tokenDataset.map((token) => {
                                  const { address, symbol, name } = token;
                                  return (
                                      <RowFlex
                                          alignItems="center"
                                          p={16}
                                          onClick={getClickHandler(token)}
                                          selected={selected === token}
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
                                                  <Box>{symbol}</Box>
                                                  <Box>{name}</Box>
                                              </Flex>
                                              <Box>
                                                  {balancesInEther &&
                                                  balancesInEther[address] &&
                                                  balancesInEther[
                                                      address
                                                  ].isGreaterThan("0.0001")
                                                      ? balancesInEther[address]
                                                            .decimalPlaces(4)
                                                            .toString()
                                                      : "-"}
                                              </Box>
                                          </Flex>
                                      </RowFlex>
                                  );
                              })
                            : null}
                    </ListFlex>
                </ContentFlex>
            </RootFlex>
        </>
    );
};

TokenModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    balances: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired,
};

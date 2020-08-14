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
    specification,
    onChange,
    supportedTokens,
    balances,
    loadingSupportedTokens,
}) => {
    const { amount, token } = specification;

    const [modalOpen, setModalOpen] = useState(false);
    const [stringAmount, setStringAmount] = useState("");
    // const [amountError, setAmountError] = useState(false);

    useEffect(() => {
        if (!stringAmount.endsWith(".")) {
            setStringAmount(
                new BigNumber(fromWei(amount)).decimalPlaces(5).toString()
            );
        }
    }, [amount, stringAmount]);

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
                // setAmountError(newAmount);
                onChange({ ...specification, amount: "0" });
                return;
            }
            if (newAmount.endsWith(".")) {
                // setAmountError(true);
            } else {
                // setAmountError(false);
            }
            if (/\.{2,}/.test(newAmount) || newAmount.split(".").length > 2) {
                return;
            }
            setStringAmount(newAmount);
            let properNumericValue = isNaN(numericAmount)
                ? "0"
                : numericAmount.toString();
            onChange({ ...specification, amount: toWei(properNumericValue) });
        },
        [onChange, specification]
    );

    const handleSelectClick = useCallback(() => {
        setModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
    }, []);

    const handleTokenChange = useCallback(
        (token) => {
            onChange({ ...specification, token });
        },
        [onChange, specification]
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
                onChange={handleTokenChange}
                supportedTokens={supportedTokens}
                selected={token}
                balances={balances}
            />
        </>
    );
};

TokenSpecifier.propTypes = {
    variant: PropTypes.oneOf(["from", "to"]),
    specification: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    supportedTokens: PropTypes.array.isRequired,
    loadingSupportedTokens: PropTypes.bool.isRequired,
};

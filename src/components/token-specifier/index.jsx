import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { RootFlex, HeaderText, Input } from "./styled";
import { Box, Flex } from "reflexbox";
import BigNumber from "bignumber.js";
import { fromWei, toWei } from "web3-utils";
import { FormattedMessage } from "react-intl";

export const TokenSpecifier = ({ variant, specification, onChange }) => {
    const { amount, token } = specification;

    const [stringAmount, setStringAmount] = useState("");
    const [amountError, setAmountError] = useState(false);

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
                setAmountError(newAmount);
                onChange({ ...specification, amount: "0" });
                return;
            }
            if (newAmount.endsWith(".")) {
                setAmountError(true);
            } else {
                setAmountError(false);
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

    return (
        <RootFlex>
            <HeaderText width="100%" mb={2}>
                <FormattedMessage id={`token.specifier.${variant}`} />
            </HeaderText>
            <Flex width="100%">
                <Box flexGrow="1">
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
            </Flex>
        </RootFlex>
    );
};

TokenSpecifier.propTypes = {
    variant: PropTypes.oneOf(["from", "to"]),
    specification: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

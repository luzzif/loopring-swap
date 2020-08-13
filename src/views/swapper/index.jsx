import React from "react";
import { Flex, Box } from "reflexbox";
import { BackgroundFlex, ArrowIcon } from "./styled";
import { TokenSpecifier } from "../../components/token-specifier";
import { useState } from "react";
import { faArrowDown, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "../../components/button";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export const Swapper = () => {
    const { supportedTokens, balances, loggedIn } = useSelector((state) => ({
        supportedTokens: state.loopring.supportedTokens.data,
        balances: state.loopring.balances.data,
        loggedIn: !!state.loopring.account,
    }));

    const [fromSpecification, setFromSpecification] = useState({
        amount: "0",
        token: null,
    });
    const [toSpecification, setToSpecification] = useState({
        amount: "0",
        token: null,
    });

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
                        supportedTokens={supportedTokens}
                        balances={balances}
                    />
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={40}
                >
                    <ArrowIcon icon={faArrowDown} />
                </Box>
                <Box>
                    <TokenSpecifier
                        variant="to"
                        specification={toSpecification}
                        onChange={handleToChange}
                        supportedTokens={supportedTokens}
                        balances={balances}
                    />
                </Box>
            </BackgroundFlex>
            <Box display="flex" justifyContent="center">
                <Button
                    faIcon={faExchangeAlt}
                    size="large"
                    disabled={
                        !loggedIn ||
                        !fromSpecification ||
                        fromSpecification.token ||
                        fromSpecification.amount === "0" ||
                        !toSpecification ||
                        toSpecification.token ||
                        toSpecification.amount === "0"
                    }
                >
                    <FormattedMessage id="swapper.action.swap" />
                </Button>
            </Box>
        </Flex>
    );
};

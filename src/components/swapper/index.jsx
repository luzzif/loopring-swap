import React from "react";
import { Flex, Box } from "reflexbox";
import { BackgroundFlex, ArrowIcon, FullWidthButton } from "./styled";
import { TokenSpecifier } from "../token-specifier";
import { useState } from "react";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";
import { Button } from "../button";
import { FormattedMessage } from "react-intl";

export const Swapper = () => {
    const [fromSpecification, setFromSpecification] = useState({ amount: "0" });
    const [toSpecification, setToSpecification] = useState({ amount: "0" });

    const handleFromChange = useCallback((newSpecification) => {
        setFromSpecification(newSpecification);
    }, []);

    const handleToChange = useCallback((newSpecification) => {
        setToSpecification(newSpecification);
    }, []);

    return (
        <Flex flexDirection="column">
            <BackgroundFlex flexDirection="column" mb={3}>
                <Box>
                    <TokenSpecifier
                        variant="from"
                        specification={fromSpecification}
                        onChange={handleFromChange}
                    />
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={32}
                >
                    <ArrowIcon icon={faArrowDown} />
                </Box>
                <Box>
                    <TokenSpecifier
                        variant="to"
                        specification={toSpecification}
                        onChange={handleToChange}
                    />
                </Box>
            </BackgroundFlex>
            <Box>
                <FullWidthButton>
                    <FormattedMessage id="swapper.action.swap" />
                </FullWidthButton>
            </Box>
        </Flex>
    );
};

import React from "react";
import { Flex, Box } from "reflexbox";
import { StyledFontAwesomeIcon, Text } from "./styled";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import { useEffect } from "react";
import { CHAIN_ID } from "../../env";

export const InvalidChainId = () => {
    const [chainName, setChainName] = useState("");

    useEffect(() => {
        let chainName;
        switch (CHAIN_ID) {
            case 1: {
                chainName = "mainnet";
                break;
            }
            case 5: {
                chainName = "Goerli";
                break;
            }
            default: {
                chainName = "unknown";
            }
        }
        setChainName(chainName);
    }, []);

    return (
        <Flex flexDirection="column" alignItems="center">
            <Box mb="20px">
                <StyledFontAwesomeIcon icon={faExclamationTriangle} />
            </Box>
            <Box textAlign="center">
                <Text>
                    <FormattedMessage
                        id="invalid.chain.id.message"
                        values={{ chainName }}
                    />
                </Text>
            </Box>
        </Flex>
    );
};

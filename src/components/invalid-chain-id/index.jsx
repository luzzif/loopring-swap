import React from "react";
import { Flex, Box } from "reflexbox";
import { StyledFontAwesomeIcon, Text } from "./styled";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import { useEffect } from "react";

export const InvalidChainId = ({ chainId }) => {
    const [chainName, setChainName] = useState("");

    useEffect(() => {
        let chainName;
        switch (chainId) {
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
    }, [chainId]);

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

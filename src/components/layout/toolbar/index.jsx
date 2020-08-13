import React from "react";
import PropTypes from "prop-types";
import { FlexContainer, Logo, SettingsIcon } from "./styled";
import { Box, Flex } from "reflexbox";
import logo from "../../../images/logo.svg";
import { Button } from "../../button";
import { faPlug, faUser, faCog } from "@fortawesome/free-solid-svg-icons";
import { FormattedMessage } from "react-intl";

export const Toolbar = ({
    onConnectingWallet,
    selectedWeb3Account,
    loggedIn,
}) => (
    <FlexContainer>
        <Box height={28}>
            <Logo src={logo} />
        </Box>
        <Flex alignItems="center" height="100%">
            <Box mr={3}>
                <SettingsIcon icon={faCog} />
            </Box>
            <Box>
                <Button
                    faIcon={
                        !loggedIn && (selectedWeb3Account ? faUser : faPlug)
                    }
                    onClick={onConnectingWallet}
                    size="small"
                >
                    {loggedIn ? (
                        selectedWeb3Account
                    ) : (
                        <FormattedMessage
                            id={
                                selectedWeb3Account
                                    ? "toolbar.action.wallet.login"
                                    : "toolbar.action.wallet.connect"
                            }
                        />
                    )}
                </Button>
            </Box>
        </Flex>
    </FlexContainer>
);

Toolbar.propTypes = {
    onConnectingWallet: PropTypes.func.isRequired,
    selectedWeb3Account: PropTypes.string,
    loggedIn: PropTypes.bool.isRequired,
};

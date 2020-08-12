import React from "react";
import PropTypes from "prop-types";
import { FlexContainer, Logo } from "./styled";
import { Box, Flex } from "reflexbox";
import logo from "../../../images/logo.svg";
import { Button } from "../../button";
import { faPlug, faUser } from "@fortawesome/free-solid-svg-icons";
import { FormattedMessage } from "react-intl";

export const Toolbar = ({
    onConnectingWallet,
    selectedWeb3Account,
    loggedIn,
}) => (
    <FlexContainer
        px={20}
        py={3}
        alignItems="center"
        justifyContent="space-between"
        width="100vw"
    >
        <Box height={36}>
            <Logo src={logo} />
        </Box>
        <Flex alignItems="center" height="100%">
            <Button
                faIcon={!loggedIn && (selectedWeb3Account ? faUser : faPlug)}
                onClick={onConnectingWallet}
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
        </Flex>
    </FlexContainer>
);

Toolbar.propTypes = {
    onConnectingWallet: PropTypes.func.isRequired,
    selectedWeb3Account: PropTypes.string,
    loggedIn: PropTypes.bool.isRequired,
};

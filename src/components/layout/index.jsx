import React from "react";
import { Toolbar } from "./toolbar";
import PropTypes from "prop-types";
import { Root, ContentContainer } from "./styled";

export const Layout = ({
    children,
    onConnectingWallet,
    selectedWeb3Account,
    loggedIn,
}) => (
    <Root>
        <Toolbar
            onConnectingWallet={onConnectingWallet}
            selectedWeb3Account={selectedWeb3Account}
            loggedIn={loggedIn}
        />
        <ContentContainer>{children}</ContentContainer>
    </Root>
);

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    onConnectingWallet: PropTypes.func.isRequired,
    selectedWeb3Account: PropTypes.string,
    loggedIn: PropTypes.bool.isRequired,
};

import React from "react";
import { Toolbar } from "./toolbar";
import PropTypes from "prop-types";
import { Root, Content } from "./styled";
import { Footer } from "./footer";

export const Layout = ({
    children,
    onConnectingWallet,
    selectedWeb3Account,
    loggedIn,
}) => (
    <Root flexDirection="column">
        <Toolbar
            onConnectingWallet={onConnectingWallet}
            selectedWeb3Account={selectedWeb3Account}
            loggedIn={loggedIn}
        />
        <Content>{children}</Content>
        <Footer />
    </Root>
);

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    onConnectingWallet: PropTypes.func.isRequired,
    selectedWeb3Account: PropTypes.string,
    loggedIn: PropTypes.bool.isRequired,
};

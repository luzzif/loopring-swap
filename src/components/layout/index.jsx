import React from "react";
import { Toolbar } from "./toolbar";
import PropTypes from "prop-types";
import { Root, Content } from "./styled";
import { Footer } from "./footer";

export const Layout = ({ children, onDrawerOpenClick }) => (
    <Root flexDirection="column">
        <Toolbar onDrawerOpenClick={onDrawerOpenClick} />
        <Content>{children}</Content>
        <Footer />
    </Root>
);

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    onDrawerOpenClick: PropTypes.func.isRequired,
};

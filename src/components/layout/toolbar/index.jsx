import React from "react";
import PropTypes from "prop-types";
import { FlexContainer, Logo, PointableIcon } from "./styled";
import { Box, Flex } from "reflexbox";
import logo from "../../../images/logo.svg";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const Toolbar = ({ onDrawerOpenClick }) => (
    <FlexContainer>
        <Box height={28}>
            <Logo src={logo} />
        </Box>
        <Flex alignItems="center" height="100%">
            <Box ml={3} onClick={onDrawerOpenClick}>
                <PointableIcon icon={faBars} />
            </Box>
        </Flex>
    </FlexContainer>
);

Toolbar.propTypes = {
    onMenuClick: PropTypes.func.isRequired,
};

import React from "react";
import PropTypes from "prop-types";
import { ListItemHeader } from "../../styled";
import { FormattedMessage } from "react-intl";
import { Flex, Box } from "reflexbox";
import { Switch } from "../../../switch";
import { TextBox } from "./styled";

export const Settings = ({ darkTheme, onDarkThemeChange }) => {
    return (
        <>
            <ListItemHeader mb={3}>
                <FormattedMessage id="drawer.wallet.connect.list.header.settings" />
            </ListItemHeader>
            <Flex px="20px" width="100%" justifyContent="space-between" mb={2}>
                <TextBox>
                    <FormattedMessage id="drawer.wallet.connect.list.settings.theme.dark" />
                </TextBox>
                <Box>
                    <Switch value={darkTheme} onChange={onDarkThemeChange} />
                </Box>
            </Flex>
        </>
    );
};

Settings.propTypes = {
    darkTheme: PropTypes.bool.isRequired,
    onDarkThemeChange: PropTypes.func.isRequired,
};

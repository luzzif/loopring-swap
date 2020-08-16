import React from "react";
import PropTypes from "prop-types";
import { ListItemHeader } from "../../styled";
import { FormattedMessage } from "react-intl";
import { Flex, Box } from "reflexbox";
import { Switch } from "../../../switch";
import { TextBox } from "./styled";
import { Chip } from "../../../chip";

export const Settings = ({
    darkTheme,
    onDarkThemeChange,
    selectedLanguage,
    onSelectedLanguageChange,
}) => {
    const getLanguageChipClickHandler = (language) => () => {
        onSelectedLanguageChange(language);
    };

    return (
        <>
            <ListItemHeader mb={3}>
                <FormattedMessage id="drawer.wallet.connect.list.header.settings" />
            </ListItemHeader>
            <Flex px="20px" width="100%" justifyContent="space-between" mb={3}>
                <TextBox>
                    <FormattedMessage id="drawer.wallet.connect.list.settings.theme.dark" />
                </TextBox>
                <Box>
                    <Switch value={darkTheme} onChange={onDarkThemeChange} />
                </Box>
            </Flex>
            <Flex px="20px" width="100%" justifyContent="space-between" mb={2}>
                <TextBox>
                    <FormattedMessage id="drawer.wallet.connect.list.settings.language" />
                </TextBox>
                <Flex alignItems="center">
                    <Box mr={2}>
                        <Chip
                            selected={selectedLanguage === "it"}
                            onClick={getLanguageChipClickHandler("it")}
                        >
                            IT
                        </Chip>
                    </Box>
                    <Box>
                        <Chip
                            selected={selectedLanguage === "en"}
                            onClick={getLanguageChipClickHandler("en")}
                        >
                            EN
                        </Chip>
                    </Box>
                </Flex>
            </Flex>
        </>
    );
};

Settings.propTypes = {
    darkTheme: PropTypes.bool.isRequired,
    onDarkThemeChange: PropTypes.func.isRequired,
    selectedLanguage: PropTypes.string.isRequired,
    onSelectedLanguageChange: PropTypes.func.isRequired,
};

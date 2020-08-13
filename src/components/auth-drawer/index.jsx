import React, { useRef, useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { Box } from "reflexbox";
import {
    faPlug,
    faLock,
    faLockOpen,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { selectedTheme } from "../../views/app";
import { FormattedMessage } from "react-intl";
import {
    RootFlex,
    HeaderFlex,
    Icon,
    FullWidthButton,
    Divider,
    EllipsizedBox,
    CloseIcon,
    SummaryMessage,
} from "./styled";
import { Lrc } from "./sections/lrc";
import { Support } from "./sections/support";
import { TechnicalResources } from "./sections/technical-resources";
import { ExchangeInfo } from "./sections/exchange-info";

export const AuthDrawer = ({
    open,
    onClose,
    onConnectWallet,
    selectedWeb3Account,
    onLogin,
    loggedIn,
}) => {
    const container = useRef(null);

    const [icon, setIcon] = useState(null);
    const [iconColor, setIconColor] = useState("");
    const [summaryMessageKey, setSummaryMessageKey] = useState("placeholder");
    const [buttonMessageKey, setButtonMessageKey] = useState("placeholder");

    useLayoutEffect(() => {
        if (loggedIn) {
            setIcon(faLockOpen);
            setIconColor(selectedTheme.success);
            setSummaryMessageKey("drawer.wallet.connect.logout");
            setButtonMessageKey("drawer.wallet.connect.action.logout");
        } else if (selectedWeb3Account) {
            setIcon(faLock);
            setIconColor(selectedTheme.error);
            setSummaryMessageKey("drawer.wallet.connect.login");
            setButtonMessageKey("drawer.wallet.connect.action.login");
        } else {
            setIcon(faPlug);
            setIconColor(selectedTheme.primary);
            setSummaryMessageKey("drawer.wallet.connect.summary");
            setButtonMessageKey("drawer.wallet.connect.action.connect");
        }
    }, [loggedIn, selectedWeb3Account]);

    return (
        <RootFlex
            flexDirection="column"
            alignItems="center"
            open={open}
            ref={container}
        >
            <HeaderFlex mb={4}>
                <EllipsizedBox>
                    {selectedWeb3Account || (
                        <FormattedMessage id="drawer.wallet.connect.header.connect" />
                    )}
                </EllipsizedBox>
                <Box ml={3}>
                    <CloseIcon icon={faTimes} onClick={onClose} />
                </Box>
            </HeaderFlex>
            <Box mb={3}>
                <Icon icon={icon} color={iconColor} fontSize="40" />
            </Box>
            <Box px={4} mb={3} fontSize="12px" textAlign="center">
                <SummaryMessage>
                    <FormattedMessage id={summaryMessageKey} />
                </SummaryMessage>
            </Box>
            <Box width="100%" px={4} mb={3}>
                <FullWidthButton
                    onClick={selectedWeb3Account ? onLogin : onConnectWallet}
                >
                    <FormattedMessage id={buttonMessageKey} />
                </FullWidthButton>
            </Box>
            <Box width="100%" mb={3}>
                <Divider />
            </Box>
            <Lrc />
            <Box width="100%" mb={3}>
                <Divider />
            </Box>
            <Support />
            <Box width="100%" mb={3}>
                <Divider />
            </Box>
            <TechnicalResources />
            <Box width="100%" mb={3}>
                <Divider />
            </Box>
            <ExchangeInfo />
        </RootFlex>
    );
};

AuthDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConnectWallet: PropTypes.func.isRequired,
    selectedWeb3Account: PropTypes.string,
    onLogin: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
};

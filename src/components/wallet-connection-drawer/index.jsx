import React, {
    useRef,
    useCallback,
    useEffect,
    useState,
    useLayoutEffect,
} from "react";
import PropTypes from "prop-types";
import { Box } from "reflexbox";
import { faPlug, faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { selectedTheme } from "../../views/app";
import { FormattedMessage } from "react-intl";
import {
    RootFlex,
    HeaderBox,
    Icon,
    FullWidthButton,
    Divider,
    EllipsizedText,
} from "./styled";
import { Lrc } from "./sections/lrc";
import { Support } from "./sections/support";
import { TechnicalResources } from "./sections/technical-resources";
import { ExchangeInfo } from "./sections/exchange-info";

export const WalletConnectionDrawer = ({
    open,
    onClose,
    onConnectWallet,
    selectedWeb3Account,
    onLogin,
    loggedIn,
}) => {
    const container = useRef(null);

    const [icon, setIcon] = useState(null);
    const [summaryMessageKey, setSummaryMessageKey] = useState("placeholder");
    const [buttonMessageKey, setButtonMessageKey] = useState("placeholder");

    useLayoutEffect(() => {
        if (loggedIn) {
            setIcon(faLockOpen);
            setSummaryMessageKey("drawer.wallet.connect.logout");
            setButtonMessageKey("drawer.wallet.connect.action.logout");
        } else if (selectedWeb3Account) {
            setIcon(faLock);
            setSummaryMessageKey("drawer.wallet.connect.summary");
            setButtonMessageKey("drawer.wallet.connect.action.login");
        } else {
            setIcon(faPlug);
            setSummaryMessageKey("drawer.wallet.connect.login");
            setButtonMessageKey("drawer.wallet.connect.action.connect");
        }
    }, [loggedIn, selectedWeb3Account]);

    const handleClick = useCallback(
        (event) => {
            if (container.current.contains(event.target)) {
                return;
            }
            onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (open) {
            document.addEventListener("mousedown", handleClick);
            return () => {
                document.removeEventListener("mousedown", handleClick);
            };
        }
    }, [handleClick, open]);

    return (
        <RootFlex
            flexDirection="column"
            alignItems="center"
            open={open}
            ref={container}
        >
            <HeaderBox mb={4}>
                <EllipsizedText>
                    {selectedWeb3Account || (
                        <FormattedMessage id="drawer.wallet.connect.header.connect" />
                    )}
                </EllipsizedText>
            </HeaderBox>
            <Box mb={3}>
                <Icon
                    icon={icon}
                    color={
                        selectedWeb3Account
                            ? selectedTheme.error
                            : selectedTheme.primary
                    }
                    fontSize="40"
                />
            </Box>
            <Box px={4} mb={3} fontSize="12px" textAlign="center">
                <FormattedMessage id={summaryMessageKey} />
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
            {/* Exchange info */}
            <Box width="100%" mb={3}>
                <Divider />
            </Box>
            <ExchangeInfo />
        </RootFlex>
    );
};

WalletConnectionDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConnectWallet: PropTypes.func.isRequired,
    selectedWeb3Account: PropTypes.string,
    onLogin: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
};

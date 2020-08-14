import React, { useState, useEffect } from "react";
import { Layout } from "../../components/layout";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styled.js";
import { useDispatch, useSelector } from "react-redux";
import MewConnect from "@myetherwallet/mewconnect-web-client";
import Web3Modal from "web3modal";
import { INFURA_ID } from "../../env";
import { useCallback } from "react";
import { Drawer } from "../../components/drawer";
import { initializeWeb3 } from "../../actions/web3";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    login,
    getSupportedTokens,
    getUserBalances,
    getSupportedMarkets,
} from "../../actions/loopring";
import { Flex, Box } from "reflexbox";
import { Swapper } from "../swapper";
import { FullScreenOverlay } from "../../components/full-screen-overlay";

const commonColors = {
    error: "#c62828",
    warning: "#FF6F00",
    primary: "#1c60ff",
    success: "#00c853",
    disabled: "rgb(202, 209, 213)",
    textDisabled: "rgba(5, 5, 5, 0.565)",
};

const light = {
    ...commonColors,
    background: "#edf2f7",
    foreground: "#dfe6ef",
    border: "#b9ccdf",
    textLight: "#999999",
    text: "#0e062d",
    textInverted: "#F1F9D2",
    shadow: "rgba(0, 0, 0, 0.4)",
    placeholder: "#b3b3b3",
    loader: "#a6a6a6",
};

const dark = {
    ...commonColors,
    background: "#151618",
    foreground: "rgba(0, 0, 0, .65)",
    border: "#23262a",
    textLight: "#4d4d4d",
    text: "#F1F9D2",
    textInverted: "#0e062d",
    shadow: "rgba(255, 255, 255, 0.1)",
    placeholder: "#666666",
    loader: "#595959",
};

const lightWeb3ModalTheme = {
    background: light.background,
    main: light.text,
    secondary: light.text,
    hover: light.foreground,
};

const darkWeb3ModalTheme = {
    background: dark.background,
    main: dark.text,
    secondary: dark.text,
    hover: dark.foreground,
};

const web3ModalOptions = {
    cacheProvider: false,
    providerOptions: {
        mewconnect: {
            package: MewConnect,
            options: {
                infuraId: INFURA_ID,
            },
        },
    },
};

export const getWeb3Modal = () => new Web3Modal(web3ModalOptions);

export let selectedTheme = light;

export const App = () => {
    const dispatch = useDispatch();

    const {
        web3Instance,
        selectedAccount: selectedWeb3Account,
        loopringAccount,
        loopringWallet,
        supportedTokens,
        supportedMarkets,
    } = useSelector((state) => ({
        web3Instance: state.web3.instance,
        selectedAccount: state.web3.selectedAccount,
        loopringAccount: state.loopring.account,
        loopringWallet: state.loopring.wallet,
        supportedTokens: state.loopring.supportedTokens.data,
        supportedMarkets: state.loopring.supportedMarkets.data,
    }));

    const [lightTheme, setLightTheme] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        dispatch(getSupportedMarkets());
    }, [dispatch]);

    useEffect(() => {
        if (supportedMarkets && supportedMarkets.length > 0) {
            dispatch(getSupportedTokens(supportedMarkets));
        }
    }, [dispatch, supportedMarkets]);

    useEffect(() => {
        if (loopringAccount && loopringWallet && supportedTokens) {
            dispatch(
                getUserBalances(
                    loopringAccount,
                    loopringWallet,
                    supportedTokens
                )
            );
        }
    }, [dispatch, loopringAccount, loopringWallet, supportedTokens]);

    // setting up local storage-saved theme
    useEffect(() => {
        const cachedTheme =
            localStorage.getItem("loopring-swap-theme") || "light";
        const lightTheme = cachedTheme === "light";
        setLightTheme(lightTheme);
        web3ModalOptions.theme = lightTheme
            ? lightWeb3ModalTheme
            : darkWeb3ModalTheme;
    }, [dispatch]);

    const handleDrawerOpenClick = useCallback(() => {
        setDrawerOpen(true);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setDrawerOpen(false);
    }, []);

    const handleConnectWallet = useCallback(() => {
        dispatch(initializeWeb3());
    }, [dispatch]);

    const handleLogin = useCallback(() => {
        dispatch(login(web3Instance, selectedWeb3Account));
    }, [dispatch, selectedWeb3Account, web3Instance]);

    const handleOverlayClick = useCallback(() => {
        setDrawerOpen(false);
    }, []);

    const handleThemeChange = useCallback(() => {
        const newLightTheme = !lightTheme;
        const textTheme = newLightTheme ? "light" : "dark";
        localStorage.setItem("loopring-swap-theme", textTheme);
        web3ModalOptions.theme = newLightTheme
            ? lightWeb3ModalTheme
            : darkWeb3ModalTheme;
        setLightTheme(newLightTheme);
        selectedTheme = newLightTheme ? light : dark;
    }, [lightTheme]);

    return (
        <ThemeProvider theme={lightTheme ? light : dark}>
            <GlobalStyle />
            <Layout
                onDrawerOpenClick={handleDrawerOpenClick}
                selectedWeb3Account={selectedWeb3Account}
                loggedIn={!!loopringAccount}
            >
                <Flex
                    width="100%"
                    height="100%"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Box width={["90%", "80%", "60%", "24%"]}>
                        <Swapper onConnectWalletClick={handleDrawerOpenClick} />
                    </Box>
                </Flex>
            </Layout>
            <FullScreenOverlay open={drawerOpen} onClick={handleOverlayClick} />
            <Drawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                onConnectWallet={handleConnectWallet}
                selectedWeb3Account={selectedWeb3Account}
                onLogin={handleLogin}
                loggedIn={!!loopringAccount}
                darkTheme={!lightTheme}
                onDarkThemeChange={handleThemeChange}
            />
            <ToastContainer
                className="custom-toast-root"
                toastClassName="custom-toast-container"
                bodyClassName="custom-toast-body"
                position="top-right"
                closeButton={false}
                transition={Slide}
                limit={3}
            />
        </ThemeProvider>
    );
};

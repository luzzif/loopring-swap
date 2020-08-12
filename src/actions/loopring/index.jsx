import React from "react";
import Wallet from "../../lightcone/wallet";
import {
    lightconeGetAccount,
    getExchangeInfo,
} from "../../lightcone/api/LightconeAPI";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export const login = (web3Instance, selectedWeb3Account) => async (
    dispatch
) => {
    try {
        const wallet = new Wallet(
            "MetaMask",
            web3Instance,
            selectedWeb3Account
        );
        // custom notification in case the account is not registered
        let account;
        try {
            account = await lightconeGetAccount(selectedWeb3Account);
        } catch (error) {
            toast.warn(<FormattedMessage id="warn.account.not.found" />);
            console.warn("account not found");
            return;
        }
        const exchange = await getExchangeInfo();
        const { exchangeAddress } = exchange;
        const { keyPair } = await wallet.generateKeyPair(
            exchangeAddress,
            account.keyNonce
        );
        if (!keyPair) {
            // the user most probably aborted the signing
            console.warn("The user aborted the signing process");
            return;
        }
        const { publicKeyX, publicKeyY } = keyPair;
        if (
            account.publicKeyX !== publicKeyX ||
            account.publicKeyY !== publicKeyY
        ) {
            throw new Error(
                "api got and locally generated public keys don't match"
            );
        }
        wallet.keyPair = keyPair;
        wallet.accountId = account.accountId;
        dispatch({ type: LOGIN_SUCCESS, account, wallet, exchange });
    } catch (error) {
        toast.error(<FormattedMessage id="error.login" />);
        console.error("error initializing loopring", error);
    }
};

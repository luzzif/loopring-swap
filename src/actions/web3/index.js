import { getWeb3Modal } from "../../views/app";
import Web3 from "web3";

export const INITIALIZE_WEB3_SUCCESS = "INITIALIZE_WEB3_SUCCESS";
export const WEB3_ACCOUNT_CHANGED = "WEB3_ACCOUNT_CHANGED";

export const initializeWeb3 = () => async (dispatch) => {
    try {
        const web3Modal = getWeb3Modal();
        const provider = await web3Modal.connect();
        provider.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
                dispatch({
                    type: WEB3_ACCOUNT_CHANGED,
                    selectedAccount: accounts[0],
                });
            }
        });
        provider.autoRefreshOnNetworkChange = false;
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        dispatch({
            type: INITIALIZE_WEB3_SUCCESS,
            web3,
            selectedAccount: accounts[0],
        });
    } catch (error) {
        console.error("error initializing web3", error);
    }
};

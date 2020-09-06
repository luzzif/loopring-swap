import { getWeb3Modal } from "../../views/app";
import Web3 from "web3";
import { logout } from "../loopring";

export const INITIALIZE_WEB3_SUCCESS = "INITIALIZE_WEB3_SUCCESS";
export const WEB3_ACCOUNT_CHANGED = "WEB3_ACCOUNT_CHANGED";
export const CHAIN_ID_CHANGED = "CHAIN_ID_CHANGED";

export const initializeWeb3 = () => async (dispatch) => {
    try {
        const web3Modal = getWeb3Modal();
        const provider = await web3Modal.connect();
        provider.autoRefreshOnNetworkChange = false;
        provider.on("chainChanged", (hexChainId) => {
            dispatch({
                type: CHAIN_ID_CHANGED,
                chainId: parseInt(hexChainId, 16),
            });
            dispatch(logout());
        });
        provider.on("accountsChanged", () => {
            dispatch(logout());
        });
        const web3 = new Web3(provider);
        dispatch({
            type: CHAIN_ID_CHANGED,
            chainId: await web3.eth.getChainId(),
        });
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

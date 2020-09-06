import {
    INITIALIZE_WEB3_SUCCESS,
    WEB3_ACCOUNT_CHANGED,
    CHAIN_ID_CHANGED,
} from "../../actions/web3";
import { LOGOUT } from "../../actions/loopring";

const initialState = {
    instance: null,
    selectedAccount: "",
    chainId: null,
};

export const web3Reducer = (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case INITIALIZE_WEB3_SUCCESS: {
            return {
                ...state,
                instance: action.web3,
                selectedAccount: action.selectedAccount,
            };
        }
        case WEB3_ACCOUNT_CHANGED: {
            return { ...state, selectedAccount: action.selectedAccount };
        }
        case CHAIN_ID_CHANGED: {
            return { ...state, chainId: action.chainId };
        }
        case LOGOUT: {
            return { ...initialState };
        }
        default: {
            return state;
        }
    }
};

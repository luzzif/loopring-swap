import {
    INITIALIZE_WEB3_SUCCESS,
    WEB3_ACCOUNT_CHANGED,
} from "../../actions/web3";

const initialState = {
    instance: null,
    selectedAccount: "",
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
        default: {
            return state;
        }
    }
};

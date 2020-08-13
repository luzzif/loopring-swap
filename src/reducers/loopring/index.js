import {
    LOGIN_SUCCESS,
    GET_SUPPORTED_TOKENS_SUCCESS,
    GET_SUPPORTED_TOKENS_START,
    GET_SUPPORTED_TOKENS_END,
} from "../../actions/loopring";

const initialState = {
    account: null,
    wallet: null,
    exchange: null,
    supportedTokens: {
        loadings: 0,
        data: [],
    },
};

export const loopringReducer = (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case LOGIN_SUCCESS: {
            return {
                ...state,
                account: action.account,
                wallet: action.wallet,
                exchange: action.exchange,
            };
        }
        case GET_SUPPORTED_TOKENS_START: {
            return {
                ...state,
                supportedTokens: {
                    ...state.supportedTokens,
                    loadings: state.supportedTokens.loadings + 1,
                },
            };
        }
        case GET_SUPPORTED_TOKENS_END: {
            return {
                ...state,
                supportedTokens: {
                    ...state.supportedTokens,
                    loadings: state.supportedTokens.loadings - 1,
                },
            };
        }
        case GET_SUPPORTED_TOKENS_SUCCESS: {
            return {
                ...state,
                supportedTokens: {
                    ...state.supportedTokens,
                    data: action.supportedTokens,
                },
            };
        }
        default: {
            return state;
        }
    }
};

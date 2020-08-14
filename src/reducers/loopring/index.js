import {
    LOGIN_SUCCESS,
    GET_SUPPORTED_TOKENS_SUCCESS,
    GET_SUPPORTED_TOKENS_START,
    GET_SUPPORTED_TOKENS_END,
    GET_USER_BALANCES_SUCCESS,
    GET_USER_BALANCES_START,
    GET_USER_BALANCES_END,
    GET_EXCHANGE_RATE_START,
    GET_EXCHANGE_RATE_END,
    GET_EXCHANGE_RATE_SUCCESS,
    GET_SUPPORTED_MARKETS_START,
    GET_SUPPORTED_MARKETS_END,
    GET_SUPPORTED_MARKETS_SUCCESS,
} from "../../actions/loopring";

const initialState = {
    account: null,
    wallet: null,
    exchange: null,
    supportedTokens: {
        loadings: 0,
        data: { fromTokens: [], toTokens: [], aggregated: [] },
    },
    supportedMarkets: {
        loadings: 0,
        data: [],
    },
    balances: {
        loadings: 0,
        data: [],
    },
    exchangeRate: {
        loadings: 0,
        data: {},
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
        case GET_SUPPORTED_MARKETS_START: {
            return {
                ...state,
                supportedMarkets: {
                    ...state.supportedMarkets,
                    loadings: state.supportedMarkets.loadings + 1,
                },
            };
        }
        case GET_SUPPORTED_MARKETS_END: {
            return {
                ...state,
                supportedMarkets: {
                    ...state.supportedMarkets,
                    loadings: state.supportedMarkets.loadings - 1,
                },
            };
        }
        case GET_SUPPORTED_MARKETS_SUCCESS: {
            return {
                ...state,
                supportedMarkets: {
                    ...state.supportedMarkets,
                    data: action.supportedMarkets,
                },
            };
        }
        case GET_USER_BALANCES_START: {
            return {
                ...state,
                balances: {
                    ...state.balances,
                    loadings: state.balances.loadings + 1,
                },
            };
        }
        case GET_USER_BALANCES_END: {
            return {
                ...state,
                balances: {
                    ...state.balances,
                    loadings: state.balances.loadings - 1,
                },
            };
        }
        case GET_USER_BALANCES_SUCCESS: {
            return {
                ...state,
                balances: {
                    ...state.balances,
                    data: action.balances,
                },
            };
        }
        case GET_EXCHANGE_RATE_START: {
            return {
                ...state,
                exchangeRate: {
                    ...state.exchangeRate,
                    loadings: state.exchangeRate.loadings + 1,
                },
            };
        }
        case GET_EXCHANGE_RATE_END: {
            return {
                ...state,
                exchangeRate: {
                    ...state.exchangeRate,
                    loadings: state.exchangeRate.loadings - 1,
                },
            };
        }
        case GET_EXCHANGE_RATE_SUCCESS: {
            return {
                ...state,
                exchangeRate: {
                    ...state.exchangeRate,
                    data: action.exchangeRate,
                },
            };
        }
        default: {
            return state;
        }
    }
};

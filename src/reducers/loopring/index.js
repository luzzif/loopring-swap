import { LOGIN_SUCCESS } from "../../actions/loopring";

const initialState = {
    account: null,
    wallet: null,
    exchange: null,
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
        default: {
            return state;
        }
    }
};

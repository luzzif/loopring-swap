import { combineReducers } from "redux";
import { web3Reducer } from "./web3";
import { loopringReducer } from "./loopring";
import { i18nReducer } from "./i18n";

export const reducers = combineReducers({
    web3: web3Reducer,
    loopring: loopringReducer,
    i18n: i18nReducer,
});

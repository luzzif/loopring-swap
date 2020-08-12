import { combineReducers } from "redux";
import { web3Reducer } from "./web3";
import { loopringReducer } from "./loopring";

export const reducers = combineReducers({
    web3: web3Reducer,
    loopring: loopringReducer,
});

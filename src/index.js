import React from "react";
import ReactDOM from "react-dom";
import { App } from "./views/app";
import { IntlProvider } from "react-intl";
import en from "./i18n/messages/en.json";
import { getLanguage } from "./i18n";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { reducers } from "./reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

const messages = { en };
let language = getLanguage("en");
if (!(language in messages)) {
    language = "en";
}

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider locale={language} messages={messages[language]}>
            <App />
        </IntlProvider>
    </Provider>,
    document.getElementById("root")
);

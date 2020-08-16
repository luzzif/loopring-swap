import React from "react";
import ReactDOM from "react-dom";
import { App } from "./views/app";
import { IntlProvider } from "react-intl";
import en from "./i18n/messages/en.json";
import it from "./i18n/messages/it.json";
import { getLanguage } from "./i18n";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { reducers } from "./reducers";
import moment from "moment";
import momentIt from "moment/locale/it";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

// setting up moment locales
moment.locale("it", momentIt);

const messages = { en, it };
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

import { SWITCH_LANGUAGE } from "../../actions/i18n";

const initialState = {
    selectedLanguage: "en",
};

export const i18nReducer = (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case SWITCH_LANGUAGE: {
            return {
                ...state,
                selectedLanguage: action.language,
            };
        }
        default: {
            return state;
        }
    }
};

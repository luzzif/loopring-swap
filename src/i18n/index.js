import moment from "moment";

export const getLanguage = fallback => {
    const rawLanguage =
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        navigator.userLanguage;
    return moment.locale(rawLanguage || fallback);
};

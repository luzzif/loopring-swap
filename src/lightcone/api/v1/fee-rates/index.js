import { request } from "../../../common";

export const getFeeRates = async (markets, accountId, apiKey) => {
    const headers = {
        "X-API-KEY": apiKey,
    };
    const params = {
        accountId,
        markets: markets.join(","),
    };
    const response = await request({
        method: "GET",
        url: "/api/v2/user/feeRates",
        headers: headers,
        params,
    });
    return response["data"];
};

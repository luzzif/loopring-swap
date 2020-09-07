import { request } from "../../../common";

// tokenIds is skip to get all tokens
export async function getBalances(accountId, apiKey, tokens, skip, limit) {
    const params = {
        accountId,
        skip,
        limit,
    };
    const headers = {
        "X-API-KEY": apiKey,
    };
    const response = await request({
        method: "GET",
        url: "/api/v2/user/balances",
        headers: headers,
        params,
    });

    return response["data"];
}

import { getApiKey } from "../lightcone/api/LightconeAPI";

export const getLoopringApiKey = async (wallet, account) => {
    const { signature } = wallet.getApiKey();
    return getApiKey(
        {
            accountId: account.accountId,
            publicKeyX: account.publicKeyX,
            publicKeyY: account.publicKeyY,
        },
        signature
    );
};


export const getShortenedEthereumAddress = (address) =>
    `${address.substring(0, 5)}...${address.substring(
        address.length - 4,
        address.length
    )}`;

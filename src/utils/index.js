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

export const weiToEther = (weiBigNumber, decimals) => {
    return weiBigNumber.dividedBy("1e" + decimals);
};

export const etherToWei = (etherBigNumber, decimals) =>
    etherBigNumber.multipliedBy("1e" + decimals);

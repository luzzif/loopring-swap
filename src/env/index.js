import env from "@mondora/env";

const NODE_ENV = env("NODE_ENV", { required: true });
if (NODE_ENV !== "production") {
    require("dotenv").config();
}

export const INFURA_URL = env("REACT_APP_INFURA_URL", {
    required: true,
});

export const CHAIN_ID = env("REACT_APP_CHAIN_ID", {
    required: true,
    parse: parseInt,
});

export const LOOPRING_API_HOST = `${
    CHAIN_ID === 1 ? "api" : "uat"
}.loopring.io`;

export const DEX_SMART_CONTRACT_ADDRESS = env(
    "REACT_APP_DEX_SMART_CONTRACT_ADDRESS",
    { required: true }
);

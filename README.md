# Loopring Swap

An effort to implement order-book-transparent L2 token swaps powered by the Loopring protocol.
Fast, cheap and painless: join the fast lane, today.

## Environment

Before you can start hacking, some environment variables setting is going to be needed. Particularly:

-   `CHAIN_ID`: the chain id to which the app refers to. It is used to determine the Loopring'a API endpoint and the general app's environment (the only supported values are `1` for mainnet and `5` for Goerli).
-   `INFURA_URL`: a valid Infura Ethereum provider URL
-   `DEX_SMART_CONTRACT_ADDRESS`: the address of the Loopring DEX smart contract in the currently active network (defined by `CHAIN_ID`). It is required, but the value does not need to be precise when developing. It is used in the drawer menu to direct the user to the correct contract on Etherscan when clicking on the "DEX smart contract" item.

The app uses `dotenv` to load environment variables during local development, so using customized variables is as simple as creating a `.env` file in the project's root and writing them there.

This being a React app, the environment variables need to be prefixed by `REACT_APP` in order to be picked up.

## Development

To start up a local instance of the app, just use the command `yarn start`.

**Stay tuned for official beta v1 release, a stable v1 and a possible v2.**

## Screenshots

Light theme | Dark theme
-|-
![screenshot-1](https://siasky.net/rACmOAUfTDiCrkUZ5lvPKqgriwos6nqfkSLnmw6xBnzEEg) | ![screenshot-2](https://siasky.net/zAD8Gs94XcvsKGbzBk2bcLvhCbEBQME6u48nXXSKRghqvQ)
![screenshot-3](https://siasky.net/3AFD83ZA-fTj8mU63ZuAtdYOYhuzfn1cIO54f-moJ900fg) | ![screenshot-4](https://siasky.net/3AEYRumBOmbr7eEXTl8AbhISz1Mp1kWgtDqkre8_0eY9iw)
![screenshot-5](https://siasky.net/3ADTvVqM4AkCtCuZ2Tldx32e0drjx_k4fce81aBXH0xeEg) | ![screenshot-6](https://siasky.net/nAAzUNwbUSUesj2qAOQZhA_Zaqzw2Zo49DKerdAroaOvsQ)

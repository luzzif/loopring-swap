import React from "react";
import { ListItemHeader, ListItemBox, ListItemIcon } from "../../styled";
import { FormattedMessage } from "react-intl";
import {
    faFile,
    faPencilRuler,
    faRulerCombined,
} from "@fortawesome/free-solid-svg-icons";
import { UndecoratedLink } from "../../../undecorated-link";
import { getEtherscanLink } from "../../../../lightcone/api/localStorgeAPI";
import { CHAIN_ID, DEX_SMART_CONTRACT_ADDRESS } from "../../../../env";

export const TechnicalResources = () => {
    return (
        <>
            <ListItemHeader mb={2}>
                <FormattedMessage id="drawer.wallet.connect.list.header.technical.resources" />
            </ListItemHeader>
            <UndecoratedLink
                href="https://docs.loopring.io/en/"
                target="_blank"
                rel="noreferrer noopener"
            >
                <ListItemBox>
                    <ListItemIcon icon={faFile} />{" "}
                    <FormattedMessage id="drawer.wallet.connect.list.item.exchange.api" />
                </ListItemBox>
            </UndecoratedLink>
            <UndecoratedLink
                href={`${getEtherscanLink(
                    CHAIN_ID
                )}/address/${DEX_SMART_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer noopener"
            >
                <ListItemBox>
                    <ListItemIcon icon={faPencilRuler} />{" "}
                    <FormattedMessage id="drawer.wallet.connect.list.item.smart.contract" />
                </ListItemBox>
            </UndecoratedLink>
            <UndecoratedLink
                href="https://loopring.org"
                target="_blank"
                rel="noreferrer noopener"
            >
                <ListItemBox>
                    <ListItemIcon icon={faRulerCombined} />{" "}
                    <FormattedMessage id="drawer.wallet.connect.list.item.loopring.protocol" />
                </ListItemBox>
            </UndecoratedLink>
        </>
    );
};

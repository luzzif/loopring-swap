import React from "react";
import { ListItemHeader, ListItemBox, ListItemIcon } from "../../styled";
import { FormattedMessage } from "react-intl";
import {
    faDollarSign,
    faClipboardCheck,
    faFileSignature,
} from "@fortawesome/free-solid-svg-icons";
import { UndecoratedLink } from "../../../undecorated-link";

export const ExchangeInfo = () => {
    return (
        <>
            <ListItemHeader mb={2}>
                <FormattedMessage id="drawer.wallet.connect.list.header.exchange.info" />
            </ListItemHeader>
            <UndecoratedLink
                href="https://loopring.io/document/fees"
                target="_blank"
                rel="noreferrer noopener"
            >
                <ListItemBox>
                    <ListItemIcon icon={faDollarSign} />{" "}
                    <FormattedMessage id="drawer.wallet.connect.list.item.fee.schedule" />
                </ListItemBox>
            </UndecoratedLink>
            <UndecoratedLink
                href="https://loopringexchange.typeform.com/to/nWXj6B"
                target="_blank"
                rel="noreferrer noopener"
            >
                <ListItemBox>
                    <ListItemIcon icon={faClipboardCheck} />{" "}
                    <FormattedMessage id="drawer.wallet.connect.list.item.token.listing" />
                </ListItemBox>
            </UndecoratedLink>
            <UndecoratedLink
                href="https://loopring.io/legal/terms"
                target="_blank"
                rel="noreferrer noopener"
            >
                <ListItemBox>
                    <ListItemIcon icon={faFileSignature} />{" "}
                    <FormattedMessage id="drawer.wallet.connect.list.item.terms.privacy" />
                </ListItemBox>
            </UndecoratedLink>
        </>
    );
};

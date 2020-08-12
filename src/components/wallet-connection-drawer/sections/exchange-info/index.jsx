import React from "react";
import { ListItemHeader, ListItemBox, ListItemIcon } from "../../styled";
import { FormattedMessage } from "react-intl";
import {
    faDollarSign,
    faClipboardCheck,
    faFileSignature,
} from "@fortawesome/free-solid-svg-icons";

export const ExchangeInfo = () => {
    return (
        <>
            <ListItemHeader mb={2}>
                <FormattedMessage id="drawer.wallet.connect.list.header.exchange.info" />
            </ListItemHeader>
            <ListItemBox>
                <ListItemIcon icon={faDollarSign} />{" "}
                <FormattedMessage id="drawer.wallet.connect.list.item.fee.schedule" />
            </ListItemBox>
            <ListItemBox>
                <ListItemIcon icon={faClipboardCheck} />{" "}
                <FormattedMessage id="drawer.wallet.connect.list.item.token.listing" />
            </ListItemBox>
            <ListItemBox>
                <ListItemIcon icon={faFileSignature} />{" "}
                <FormattedMessage id="drawer.wallet.connect.list.item.terms.privacy" />
            </ListItemBox>
        </>
    );
};

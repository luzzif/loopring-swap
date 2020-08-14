import React from "react";
import { ListItemHeader, ListItemBox, ListItemIcon } from "../../styled";
import { FormattedMessage } from "react-intl";
import {
    faFile,
    faPencilRuler,
    faRulerCombined,
} from "@fortawesome/free-solid-svg-icons";

export const TechnicalResources = () => {
    return (
        <>
            <ListItemHeader mb={2}>
                <FormattedMessage id="drawer.wallet.connect.list.header.technical.resources" />
            </ListItemHeader>
            <ListItemBox>
                <ListItemIcon icon={faFile} />{" "}
                <FormattedMessage id="drawer.wallet.connect.list.item.exchange.api" />
            </ListItemBox>
            <ListItemBox>
                <ListItemIcon icon={faPencilRuler} />{" "}
                <FormattedMessage id="drawer.wallet.connect.list.item.smart.contract" />
            </ListItemBox>
            <ListItemBox>
                <ListItemIcon icon={faRulerCombined} />{" "}
                <FormattedMessage id="drawer.wallet.connect.list.item.loopring.protocol" />
            </ListItemBox>
        </>
    );
};

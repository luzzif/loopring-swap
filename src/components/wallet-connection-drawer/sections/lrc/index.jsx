import React from "react";
import { ListItemHeader, ListItemBox, ListItemIcon } from "../../styled";
import { FormattedMessage } from "react-intl";
import { faMagnet } from "@fortawesome/free-solid-svg-icons";

export const Lrc = () => {
    return (
        <>
            <ListItemHeader mb={2}>
                <FormattedMessage id="drawer.wallet.connect.list.header.lrc" />
            </ListItemHeader>
            <ListItemBox>
                <ListItemIcon icon={faMagnet} />{" "}
                <FormattedMessage id="drawer.wallet.connect.list.item.staking" />
            </ListItemBox>
        </>
    );
};

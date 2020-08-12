import React from "react";
import { ListItemHeader, ListItemBox, ListItemIcon } from "../../styled";
import { FormattedMessage } from "react-intl";
import { faQuestionCircle, faSms } from "@fortawesome/free-solid-svg-icons";
import { faTelegram, faDiscord } from "@fortawesome/free-brands-svg-icons";

export const Support = () => {
    return (
        <>
            <ListItemHeader mb={2}>
                <FormattedMessage id="drawer.wallet.connect.list.header.support" />
            </ListItemHeader>
            <ListItemBox>
                <ListItemIcon icon={faQuestionCircle} />{" "}
                <FormattedMessage id="drawer.wallet.connect.list.item.faq" />
            </ListItemBox>
            <ListItemBox>
                <ListItemIcon icon={faSms} />{" "}
                <FormattedMessage id="drawer.wallet.connect.list.item.wechat" />
            </ListItemBox>
            <ListItemBox>
                <ListItemIcon icon={faTelegram} />{" "}
                <FormattedMessage id="drawer.wallet.connect.list.item.telegram" />
            </ListItemBox>
            <ListItemBox>
                <ListItemIcon icon={faDiscord} />{" "}
                <FormattedMessage id="drawer.wallet.connect.list.item.discord" />
            </ListItemBox>
            <ListItemBox>
                <ListItemIcon icon={faQuestionCircle} />{" "}
                <FormattedMessage id="drawer.wallet.connect.list.item.bug.report" />
            </ListItemBox>
        </>
    );
};

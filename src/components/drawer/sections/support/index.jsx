import React from "react";
import { ListItemHeader, ListItemBox, ListItemIcon } from "../../styled";
import { FormattedMessage } from "react-intl";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faTelegram, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { UndecoratedLink } from "../../../undecorated-link";

export const Support = () => {
    return (
        <>
            <ListItemHeader mb={2}>
                <FormattedMessage id="drawer.wallet.connect.list.header.support" />
            </ListItemHeader>
            <UndecoratedLink
                href="https://medium.com/loopring-protocol/loopring-exchange-faq-196d6c40f6cf"
                target="_blank"
                rel="noreferrer noopener"
            >
                <ListItemBox>
                    <ListItemIcon icon={faQuestionCircle} />{" "}
                    <FormattedMessage id="drawer.wallet.connect.list.item.faq" />
                </ListItemBox>
            </UndecoratedLink>
            <UndecoratedLink
                href="https://t.me/loopring_en"
                target="_blank"
                rel="noreferrer noopener"
            >
                <ListItemBox>
                    <ListItemIcon icon={faTelegram} />{" "}
                    <FormattedMessage id="drawer.wallet.connect.list.item.telegram" />
                </ListItemBox>
            </UndecoratedLink>
            <UndecoratedLink
                href="https://discordapp.com/invite/KkYccYp"
                target="_blank"
                rel="noreferrer noopener"
            >
                <ListItemBox>
                    <ListItemIcon icon={faDiscord} />{" "}
                    <FormattedMessage id="drawer.wallet.connect.list.item.discord" />
                </ListItemBox>
            </UndecoratedLink>
            <UndecoratedLink
                href="https://github.com/Loopring/dexwebapp/issues/new"
                target="_blank"
                rel="noreferrer noopener"
            >
                <ListItemBox>
                    <ListItemIcon icon={faQuestionCircle} />{" "}
                    <FormattedMessage id="drawer.wallet.connect.list.item.bug.report" />
                </ListItemBox>
            </UndecoratedLink>
        </>
    );
};

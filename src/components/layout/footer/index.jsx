import React from "react";
import { FlexContainer, WarningText } from "./styled";
import { version } from "../../../../package.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { UndecoratedLink } from "../../undecorated-link";
import { FormattedMessage } from "react-intl";
import { Box } from "reflexbox";

export const Footer = () => (
    <FlexContainer flexDirection="column" pb="8px">
        <Box mb="4px" textAlign="center">
            Powered by Ethereum & Loopring &middot; v{version} &middot;{"  "}
            <UndecoratedLink
                href="https://github.com/luzzif/loopring-swap"
                target="_blank"
                rel="noreferrer noopener"
            >
                <FontAwesomeIcon icon={faGithub} />
            </UndecoratedLink>
        </Box>
        <Box textAlign="center">
            <WarningText>
                <FormattedMessage id="footer.warning" />
            </WarningText>
        </Box>
    </FlexContainer>
);

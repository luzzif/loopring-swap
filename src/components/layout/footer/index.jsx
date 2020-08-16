import React from "react";
import { FlexContainer } from "./styled";
import { Box } from "reflexbox";
import { version } from "../../../../package.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum, faGithub } from "@fortawesome/free-brands-svg-icons";
import { UndecoratedLink } from "../../undecorated-link";

export const Footer = () => (
    <FlexContainer>
        <Box height={36}>
            Powered by <FontAwesomeIcon icon={faEthereum} /> & Loopring &middot;
            Version {version} &middot;{" "}
            <UndecoratedLink
                href="https://github.com/luzzif/loopring-swap"
                target="_blank"
                rel="noreferrer noopener"
            >
                <FontAwesomeIcon icon={faGithub} />
            </UndecoratedLink>
        </Box>
    </FlexContainer>
);

import React from "react";
import { FlexContainer } from "./styled";
import { Box } from "reflexbox";
import { version } from "../../../../package.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum, faGithub } from "@fortawesome/free-brands-svg-icons";
import { UndecoratedLink } from "../../undecorated-link";

export const Footer = () => (
    <div>
    <FlexContainer>
            Powered by Ethereum & Loopring &middot;
           - {version} &middot;{" "}
            <UndecoratedLink
                href="https://github.com/luzzif/loopring-swap"
                target="_blank"
                rel="noreferrer noopener"
            >
                <FontAwesomeIcon icon={faGithub} />
            </UndecoratedLink>

    </FlexContainer>
    <FlexContainer>
     Source code not audited by Loopring. Use it at your own risk!
    </FlexContainer>
    </div>
);
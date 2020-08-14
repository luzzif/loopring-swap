import React from "react";
import { FlexContainer } from "./styled";
import { Box } from "reflexbox";
import { version } from "../../../../package.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

export const Footer = () => (
    <FlexContainer>
        <Box height={36}>
            Powered by <FontAwesomeIcon icon={faEthereum} /> & Loopring &middot;
            Version {version}
        </Box>
    </FlexContainer>
);

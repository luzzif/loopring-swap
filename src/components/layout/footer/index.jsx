import React from "react";
import { FlexContainer, Logo } from "./styled";
import { Box } from "reflexbox";
import { version } from "../../../../package.json";

export const Footer = () => (
    <FlexContainer>
        <Box height={36}>
            Powered by Ethereum & Loopring &middot; Version {version}
        </Box>
    </FlexContainer>
);

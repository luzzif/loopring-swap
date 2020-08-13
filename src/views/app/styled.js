import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html {
        height: 100%;
        font-family: "Montserrat", sans-serif;
    }

    body {
        margin: 0;
        height: 100%;
    }

    #root {
        height: 100%;
    }

    .custom-toast-root {
        width: auto !important;
    }

    @media (max-width: 600px) {
        .custom-toast-root {
            left: 16px !important;
            right: 16px !important;
        }
    }

    .custom-toast-container {
        margin-top: 16px !important;
        box-shadow: 0px 30px 62px 0px ${(props) =>
            props.theme.shadow} !important;
        border-radius: 4px !important;
    }

    .custom-toast-body {
        font-size: 16px;
        font-family: "Montserrat", sans-serif;
        margin: 0;
        padding: 4px 12px;
    }

    .Toastify__toast {
        min-height: 0;
    }
    
    .Toastify__toast--warning {
        background: ${(props) => props.theme.warning} !important;
    }
    
    .Toastify__toast--error {
        background: ${(props) => props.theme.error} !important;
    }

    .web3modal-provider-container,
    .web3modal-modal-card {
        border-radius: 4px !important;
    }
`;

export const FullScreenOverlay = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #000;
    opacity: ${(props) => (props.open ? "0.5" : "0")};
    transform: translateY(${(props) => (props.open ? "0" : "100000px")});
    transition: ${(props) =>
        props.open
            ? "opacity 0.5s ease"
            : "transform 0.5s ease 0.5s, opacity 0.5s ease"};
`;

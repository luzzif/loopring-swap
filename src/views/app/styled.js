import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'Montserrat';
        font-weight: 500;
        src: url('../../fonts/Montserrat-Regular.ttf'),
            format('truetype');
    }

    @font-face {
        font-family: 'Montserrat';
        font-weight: 600;
        src: url('../../fonts/Montserrat-SemiBold.ttf'),
            format('truetype');
    }

    @font-face {
        font-family: 'Montserrat';
        font-weight: 700;
        src: url('../../fonts/Montserrat-Bold.ttf'),
            format('truetype');
    }

    html {
        height: 100%;
        font-family: Montserrat, sans-serif;
        font-size: 13px;
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
        border-radius: 12px !important;
    }

    .custom-toast-body {
        font-size: 16px;
        margin: 0;
        padding: 4px 12px;
    }

    .Toastify__toast {
        min-height: 0;
        font-family: Montserrat, sans-serif;
    }

    .Toastify__toast--warning {
        background: ${(props) => props.theme.warning} !important;
    }

    .Toastify__toast--error {
        background: ${(props) => props.theme.error} !important;
    }

    .web3modal-provider-container,
    .web3modal-modal-card {
        border-radius: 12px !important;
    }
`;

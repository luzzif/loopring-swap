import { createGlobalStyle } from "styled-components";

const BrowserGlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Montserrat-Regular';
    font-weight: normal;
    font-style: normal;
    src: local('Montserrat-Regular'),
      url(/assets/fonts/Montserrat/Montserrat-Regular.ttf) format('truetype');
  }

  @font-face {
    font-family: 'Montserrat-Italic';
    font-weight: normal;
    font-style: normal;
    src: local('Montserrat-Italic'),
      url(/assets/fonts/Montserrat/Montserrat-Italic.ttf) format('truetype');
  }

  @font-face {
    font-family: 'Montserrat-Medium';
    font-weight: normal;
    font-style: normal;
    src: local('Montserrat-Medium'),
      url(/assets/fonts/Montserrat/Montserrat-Medium.ttf) format('truetype');
  }

  @font-face {
    font-family: 'Montserrat-Bold';
    font-weight: bold;
    font-style: normal;
    src: local('Montserrat-Bold'),
      url(/assets/fonts/Montserrat/Montserrat-Bold.ttf) format('truetype');
  }

  @font-face {
    font-family: 'Montserrat-Light';
    font-weight: 300;
    font-style: normal;
    src: local('Montserrat-Light'),
      url(/assets/fonts/Montserrat/Montserrat-Light.ttf) format('truetype');
  }

  html {
    font-size: 13px;
  }


`;

export default BrowserGlobalStyles;

import styled from "styled-components";

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
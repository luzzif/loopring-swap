import styled from "styled-components";

export const FullScreenOverlay = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${(props) => props.theme.shadow};
    opacity: ${(props) => (props.open ? "1" : "0")};
    transform: translateY(${(props) => (props.open ? "0" : "150%")});
    transition: ${(props) =>
            props.open
                ? "opacity 0.3s ease"
                : "transform 0.3s ease 0.3s, opacity 0.3s ease"},
        background 0.3s ease;
`;

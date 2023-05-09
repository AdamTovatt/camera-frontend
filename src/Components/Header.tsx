import React from "react";
import styled from "styled-components";
import { Aperture } from "react-feather";
import { Color } from "./Constants";

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #303435;
    padding: 0 1rem;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 3rem;
    z-index: 100;
    justify-content: flex-start;
`;

const Logo = styled.h1`
  color: ${Color.White};
  font-size: 24px;
  margin: 0;
`;

const HeaderText = styled.h2`
  color: ${Color.White};
  font-size: 16px;
  margin: 0;
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;


function Header() {
    return (
        <HeaderContainer>
            <Logo><Aperture style={{ color: Color.White }} /></Logo>
            <h1>Camera Viewer</h1>
            <HeaderText>Logged in as:</HeaderText>
        </HeaderContainer>
    );
}

export default Header;
import React from "react";
import styled from "styled-components";
import { Aperture } from "react-feather";
import { Color } from "./Constants";
import HorizontalSpacing from "./HorizontalSpacing";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #303435;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 5rem;
  z-index: 100;
  justify-content: flex-start;
  align-content: center;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1.2rem;
  margin-right: 1.2rem;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${Color.Height2Lighter};
    scale: 1.05;
    border-radius: 32px;
  }
`;

const HeaderText = styled.div`
  color: ${Color.White};
  font-size: 24px;
  display: flex;
  justify-content: center;
`;

function Header({onLogoClick}: {onLogoClick: () => void}) {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo
          onClick={() => {
            onLogoClick();
          }}
        >
          <Aperture style={{ color: Color.White, strokeWidth: 1 }} size={52} />
        </Logo>
        <HorizontalSpacing width={0.8} />
        <HeaderText>Keycard</HeaderText>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;

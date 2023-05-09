import { ReactNode } from "react";
import styled from "styled-components";
import { Color } from "./Constants";

const SmallButton = styled.button`
  background-color: ${Color.Height2};
  cursor: pointer;
  border: none;
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${Color.Height2Lighter};
    scale: 1.05;
  }
`;

function IconButton({
  icon,
  onClick,
}: {
  icon: ReactNode;
  onClick: () => void;
}) {
  return <SmallButton onClick={onClick}>{icon}</SmallButton>;
}

export default IconButton;

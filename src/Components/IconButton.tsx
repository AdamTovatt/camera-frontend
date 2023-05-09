import { ReactNode } from "react";
import styled from "styled-components";
import { Color } from "./Constants";

const SmallButton = styled.button`
  background-color: ${Color.Height2};
  cursor: pointer;
  border: none;
  border-radius: 5px;
  padding: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${Color.Height1};
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

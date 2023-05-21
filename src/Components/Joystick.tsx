import React from "react";
import styled from "styled-components";
import { Aperture } from "react-feather";
import { Color } from "./Constants";
import { moveCamera } from "../Functions/Api";

const MainContainer = styled.div`
  min-width: 100%;
  width: 100%;
  color: ${Color.White};
  font-size: 24px;
  display: flex;
  justify-content: left;

  @media (max-width: 560px) {
    justify-content: center;
  }
`;

const InnerContainer = styled.div`
  background-color: ${Color.Height1};
  min-width: 10rem;
  min-height: 10rem;
  max-width: 10rem;
  max-height: 10rem;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

interface HandleProps {
  pitch: number;
  yaw: number;
}

const HandleCenter = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: move;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.5);

  background-color: rgba(0, 0, 0, 0);
  background-image: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(220, 215, 201, 0.2) 100%
  );
  filter: blur(4px);
`;

const Handle = styled.div.attrs((props: HandleProps) => ({
  style: {
    top: `${props.pitch}%`,
    left: `${props.yaw}%`,
  },
}))<HandleProps>`
  background-color: ${Color.White};
  width: 25px;
  height: 25px;
  border-radius: 50%;
  position: relative;
  transform: translate(-50%, -50%);
  cursor: move;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.5);
  border: 2px solid ${Color.Height2Lighter};
`;

export default function Joystick({ cameraId }: { cameraId: number }) {
  const [joyStickMouseDown, setJoyStickMouseDown] =
    React.useState<boolean>(false);
  const [pitch, setPitch] = React.useState<number>(50);
  const [yaw, setYaw] = React.useState<number>(50);
  const [lastSentPitch, setLastSentPitch] = React.useState<number>(20);
  const [lastSentYaw, setLastSentYaw] = React.useState<number>(20);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!joyStickMouseDown) return;

    const containerRect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - containerRect.left;
    const offsetY = event.clientY - containerRect.top;

    const newYaw = Math.max(
      Math.min((offsetX / containerRect.width) * 100, 100),
      0
    );
    const newPitch = Math.max(
      Math.min((offsetY / containerRect.height) * 100, 100),
      0
    );

    // Update the pitch and yaw state
    setPitch(newPitch);
    setYaw(newYaw);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (lastSentPitch === pitch && lastSentYaw === yaw) {
        return;
      }

      const sendPitch = (pitch / 100) * 2 - 1;
      const sendYaw = (yaw / 100) * 2 - 1;

      console.log("pitch: " + sendPitch + "\nyaw: " + sendYaw);

      moveCamera(cameraId, sendPitch, sendYaw);

      setLastSentPitch(pitch);
      setLastSentYaw(yaw);
    }, 100); // 100 milliseconds = 0.1 seconds
    return () => {
      clearInterval(interval);
    };
  }, [joyStickMouseDown, pitch, yaw, lastSentPitch, lastSentYaw, cameraId]);

  return (
    <MainContainer
      onMouseUp={() => {
        setJoyStickMouseDown(false);
      }}
      onMouseDown={() => {
        setJoyStickMouseDown(true);
      }}
    >
      <InnerContainer onMouseMove={handleMouseMove}>
        <Handle pitch={pitch} yaw={yaw}>
          <HandleCenter></HandleCenter>
        </Handle>
      </InnerContainer>
    </MainContainer>
  );
}

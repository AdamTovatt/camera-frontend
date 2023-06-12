import styled from "styled-components";
import { Color } from "./Constants";
import { Maximize2, Tv, VideoOff } from "react-feather";
import { CameraInformation } from "./Pages/CameraDetailsPage";
import VerticalSpacing from "./VerticalSpacing";
import IconButton from "./IconButton";
import { useState } from "react";
import WebSocketStream from "./WebSocketStream";

const MainContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const ImageContainer = styled.div`
  border-radius: 10px;
  background-color: ${Color.Height1};
  padding: 1rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  color: ${Color.White};
`;

const ImageContainerBottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActiveText = styled.div``;

const FullScreenImageContainer = styled.div`
  background-color: ${Color.Height0};
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
`;

function ImageWindow({
  camera,
  lastDate,
  onConnectionEstablished,
}: {
  camera: CameraInformation;
  lastDate: Date;
  onConnectionEstablished: (webSocket: WebSocket) => void;
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <MainContainer>
      <ImageContainer>
        {isFullScreen ? (
          <FullScreenImageContainer
            onClick={() => {
              setIsFullScreen(false);
            }}
          >
            <WebSocketStream
              camera={camera}
              fullScreen={true}
              onConnectionEstablished={onConnectionEstablished}
            />
          </FullScreenImageContainer>
        ) : (
          <WebSocketStream
            camera={camera}
            fullScreen={false}
            onConnectionEstablished={onConnectionEstablished}
          />
        )}
        <VerticalSpacing />
        <ImageContainerBottomRow>
          <ActiveText>{/*GetCameraStatus({ lastDate })*/}</ActiveText>
          <IconButton
            icon={<Maximize2 color={Color.White} />}
            onClick={() => {
              setIsFullScreen(true);
            }}
          />
        </ImageContainerBottomRow>
      </ImageContainer>
    </MainContainer>
  );
}

/*
function GetCameraStatus({ lastDate }: { lastDate: Date }): string {
  const timeSinceActive = (new Date().getTime() - lastDate.getTime()) / 1000; // 1000 = 1 second in milliseconds (we want to convert to seconds)

  if (timeSinceActive < 10) return "(Live view)";
  if (timeSinceActive < 120) return timeSinceActive + " seconds ago";
  if (timeSinceActive < 3600)
    return Math.floor(timeSinceActive / 60) + " minutes ago";

  return "Last active: " + new Date(lastDate).toLocaleString();
}
*/

export default ImageWindow;

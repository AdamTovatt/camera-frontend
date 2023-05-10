import styled from "styled-components";
import { Color } from "./Constants";
import { Maximize2, Tv, VideoOff } from "react-feather";
import { CameraInformation } from "./Pages/CameraDetailsPage";
import VerticalSpacing from "./VerticalSpacing";
import IconButton from "./IconButton";
import { useState } from "react";

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

const Image = styled.img`
  max-width: 100%;
`;

const FullScreenImage = styled.img`
  position: fixed;
  width: 100vw;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
`;

const FullScreenImageContainer = styled.div`
  background-color: ${Color.Height0};
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
`;

const ImagePlaceHolder = styled.div`
  background-color: ${Color.Height0};
  width: 640px;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 1px 3px 3px rgba(0, 0, 0, 0.5);
  flex-direction: column;
  font-family: "Jost";
  font-size: 20px;
  color: ${Color.White};
  max-width: calc(100vw - 4rem);
`;

function ImageWindow({
  imageSource,
  camera,
}: {
  imageSource: string | undefined;
  camera: CameraInformation;
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <MainContainer>
      <ImageContainer>
        {imageSource ? (
          <>
            {imageSource.length > 100 ? (
              <>
                {isFullScreen ? (
                  <FullScreenImageContainer
                    onClick={() => {
                      setIsFullScreen(false);
                    }}
                  >
                    <FullScreenImage src={imageSource} />
                  </FullScreenImageContainer>
                ) : (
                  <Image src={imageSource} />
                )}
              </>
            ) : (
              <ImagePlaceHolder>
                <VideoOff size={128} strokeWidth={1} />
                Camera is offline
              </ImagePlaceHolder>
            )}
          </>
        ) : (
          <ImagePlaceHolder>
            <Tv size={128} strokeWidth={1} />
            Loading camera...
          </ImagePlaceHolder>
        )}
        <VerticalSpacing />
        <ImageContainerBottomRow>
          <ActiveText>{GetCameraStatus({ camera })}</ActiveText>
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

function GetCameraStatus({ camera }: { camera: CameraInformation }): string {
  const timeSinceActive =
    (new Date().getTime() - new Date(camera.lastActive).getTime()) / 1000; // 1000 = 1 second in milliseconds (we want to convert to seconds)

  if (timeSinceActive < 10) return "(Live view)";
  if (timeSinceActive < 120) return timeSinceActive + " seconds ago";
  if (timeSinceActive < 3600)
    return Math.floor(timeSinceActive / 60) + " minutes ago";

  return "Last active: " + new Date(camera.lastActive).toLocaleString();
}

export default ImageWindow;

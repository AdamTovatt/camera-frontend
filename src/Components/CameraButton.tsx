import styled from "styled-components";
import { Color } from "./Constants";
import { CameraInformation } from "./Pages/CameraDetailsPage";
import { Circle, VideoOff } from "react-feather";
import HorizontalSpacing from "./HorizontalSpacing";

const MainContainer = styled.button`
  flex: 1;
  width: 100%;
  background-color: ${Color.Height1};
  cursor: pointer;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  font-family: "Jost";
  color: ${Color.White};
  font-size: 16px;
  margin-bottom: 1rem;

  &:hover {
    background-color: ${Color.Height1Lighter};
    scale: 1.02;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0.5rem;
  justify-content: space-between;
  align-items: center;
`;

const InnerContainerLeftSide = styled.div`
  display: flex;
`;

const PreviewImage = styled.img`
  width: 4rem;
  height: 3rem;
  border-radius: 10px;
`;

const PreviewImagePlaceholder = styled.div`
  width: 4rem;
  height: 3rem;
  border-radius: 10px;
  background-color: ${Color.Height0};
  display: flex;
  align-items: center;
  justify-content: center;
`;

function CameraButton({
  camera,
  onClick,
}: {
  camera: CameraInformation;
  onClick: () => void;
}) {
  const statusColor = GetCameraStatusColor({ camera });

  return (
    <MainContainer onClick={onClick}>
      <InnerContainer>
        <InnerContainerLeftSide>
          <HorizontalSpacing width={1} />
          <Circle width={"1rem"} fill={statusColor} color={statusColor} />
          <HorizontalSpacing width={1} />
          {camera.name}
        </InnerContainerLeftSide>
        {camera.preview ? (
          <PreviewImage src={`data:image/jpeg;base64,${camera.preview}`} />
        ) : (
          <PreviewImagePlaceholder>
            <VideoOff />
          </PreviewImagePlaceholder>
        )}
      </InnerContainer>
    </MainContainer>
  );
}

function GetCameraStatusColor({
  camera,
}: {
  camera: CameraInformation;
}): string {
  const timeSinceActive =
    (new Date().getTime() - new Date(camera.lastActive).getTime()) / 3600000; // 3600000 = 1 hour in milliseconds (we want to convert to hours)
  if (timeSinceActive > 1) return Color.Negative;
  else if (timeSinceActive > 0.1) return Color.Warning;
  else return Color.Positive;
}

export default CameraButton;

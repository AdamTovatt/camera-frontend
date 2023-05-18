import styled from "styled-components";
import { Color } from "./Constants";
import { CameraInformation } from "./Pages/CameraDetailsPage";
import { Circle, VideoOff } from "react-feather";
import HorizontalSpacing from "./HorizontalSpacing";
import { GetCameraStatusColor } from "../Functions/General";

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

export default CameraButton;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getCameraList } from "../../Functions/Api";
import { Color } from "../Constants";
import IconButton from "../IconButton";
import { ArrowLeft } from "react-feather";
import HorizontalSpacing from "../HorizontalSpacing";

interface ImageUpdateEvent {
  data: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  border: 5px solid ${Color.Height1};
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

const SelectableButton = styled.button<{ isSelected: boolean }>`
  margin: 0 10px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background-color: ${(props) => (props.isSelected ? "#ccc" : "#fff")};
  cursor: pointer;
`;

const DetailsViewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderText = styled.div`
  margin-left: 1rem;
  color: ${Color.White};
`;

export interface CameraInformation {
  id: number;
  name: string;
  description: string;
  preview: string | null;
  lastActive: string;
}

function CameraDetailsPage({
  camera,
  onClosedDetailsView,
}: {
  camera: CameraInformation;
  onClosedDetailsView: () => void;
}) {
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [cameras, setCameras] = useState<CameraInformation[]>([]);
  const [selectedCamera, setSelectedCamera] =
    useState<CameraInformation | null>(camera);

  useEffect(() => {
    if (!selectedCamera) return;
    const endpointUrl =
      process.env.REACT_APP_API_ENDPOINT_URL +
      `/camera/stream-image?cameraId=${selectedCamera.id}&updateDelay=1500`;

    if (!endpointUrl) {
      throw new Error(
        "API endpoint URL not specified in environment variables!"
      );
    }

    const eventSource = new EventSource(endpointUrl);

    eventSource.addEventListener("image-update", (event: ImageUpdateEvent) => {
      console.log("image-update");
      setImageDataUrl(event.data);
    });

    eventSource.addEventListener("error", (event) => {
      console.log("error", event);
    });

    return () => {
      eventSource.close();
    };
  }, [selectedCamera, cameras]);

  useEffect(() => {
    getCameraList().then((data) => {
      console.log(data);
      setCameras(data);
    });
  }, []);

  return (
    <Container>
      <DetailsViewHeader>
        <IconButton
          onClick={() => {
            onClosedDetailsView();
          }}
          icon={<ArrowLeft color={Color.White} />}
        />
        <HeaderText>{selectedCamera?.name}</HeaderText>
      </DetailsViewHeader>
      <HorizontalSpacing />
      <Image src={imageDataUrl} />
      <ButtonContainer>
        {cameras.map((camera, index) => (
          <SelectableButton
            key={index}
            isSelected={selectedCamera === camera}
            onClick={() => setSelectedCamera(camera)}
          >
            Camera {camera.id}
          </SelectableButton>
        ))}
      </ButtonContainer>
    </Container>
  );
}

export default CameraDetailsPage;

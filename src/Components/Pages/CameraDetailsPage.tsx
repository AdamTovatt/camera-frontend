import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getCameraList } from "../../Functions/Api";
import { Color } from "../Constants";
import IconButton from "../IconButton";
import { ArrowLeft } from "react-feather";
import ImageWindow from "../ImageWindow";
import Header from "../Header";
import VerticalSpacing from "../VerticalSpacing";
import Joystick from "../Joystick";

interface ImageUpdateEvent {
  data: string;
}

const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
`;

const InnerPage = styled.div`
  margin-left: 2rem;
  margin-right: 2rem;

  max-width: calc(100% - 2rem);
  color: ${Color.White};

  @media (max-width: 560px) {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

const DetailsViewHeader = styled.div`
  display: flex;
  align-items: center;
`;

const DescriptionText = styled.div`
  color: ${Color.White};
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
  lastActive: Date;
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!selectedCamera) return;
  }, [selectedCamera]);

  useEffect(() => {
    getCameraList().then((data) => {
      console.log(data);
      setCameras(data);
    });
  }, []);

  return (
    <Page>
      <Header onLogoClick={onClosedDetailsView}/>
      <VerticalSpacing height={7} />
      <InnerPage>
        <CameraViewSection
          selectedCamera={selectedCamera}
          onClosedDetailsView={onClosedDetailsView}
          lastDate={lastUpdated || new Date("2023-05-01")}
          onConnectionEstablished={(webSocket) => {
            setWebSocket(webSocket);
          }}
        />
        <VerticalSpacing height={1} />
        Camera control:
        <VerticalSpacing height={0.5} />
        {selectedCamera && webSocket && (
          <Joystick cameraId={selectedCamera.id} websocket={webSocket} />
        )}
        <CameraDescriptionSection selectedCamera={selectedCamera} />
        <VerticalSpacing height={1.5} />
        <VerticalSpacing height={4.5} />
      </InnerPage>
    </Page>
  );
}

function CameraDescriptionSection({
  selectedCamera,
}: {
  selectedCamera: CameraInformation | null;
}) {
  return (
    <>
      <VerticalSpacing height={1.5} />
      <DescriptionText>
        Description: {selectedCamera?.description}
      </DescriptionText>
    </>
  );
}

function CameraViewSection({
  selectedCamera,
  onClosedDetailsView,
  lastDate,
  onConnectionEstablished,
}: {
  selectedCamera: CameraInformation | null;
  onClosedDetailsView: () => void;
  lastDate: Date;
  onConnectionEstablished: (webSocket: WebSocket) => void;
}) {
  return (
    <>
      <DetailsViewHeader>
        <IconButton
          onClick={() => {
            onClosedDetailsView();
          }}
          icon={<ArrowLeft color={Color.White} />}
        />
        <HeaderText>{selectedCamera?.name}</HeaderText>
      </DetailsViewHeader>
      <VerticalSpacing height={1.5} />
      {selectedCamera && (
        <ImageWindow
          camera={selectedCamera}
          lastDate={lastDate}
          onConnectionEstablished={onConnectionEstablished}
        />
      )}
    </>
  );
}

export default CameraDetailsPage;

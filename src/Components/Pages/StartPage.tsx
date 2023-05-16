import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CameraInformation } from "./CameraDetailsPage";
import { getCameraList } from "../../Functions/Api";
import Header from "../Header";
import CameraButton from "../CameraButton";
import VerticalSpacing from "../VerticalSpacing";
import { Color } from "../Constants";

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

const CameraListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 30rem;
  max-width: 100%;
`;

function StartPage({
  onLogin,
  onSelectedCamera,
}: {
  onLogin: () => void;
  onSelectedCamera: (camera: CameraInformation) => void;
}) {
  const [cameras, setCameras] = useState<CameraInformation[]>([]);

  useEffect(() => {
    getCameraList().then((data) => {
      console.log(data);
      setCameras(data);
    });
  }, []);

  console.log(cameras);

  return (
    <Page>
      <Header />
      <InnerPage>
        <VerticalSpacing height={7} />
        Cameras:
        <VerticalSpacing height={1.5} />
        <CameraListContainer>
          {cameras.map((camera, index) => (
            <CameraButton
              key={index}
              onClick={() => onSelectedCamera(camera)}
              camera={camera}
            />
          ))}
        </CameraListContainer>
      </InnerPage>
    </Page>
  );
}

export default StartPage;

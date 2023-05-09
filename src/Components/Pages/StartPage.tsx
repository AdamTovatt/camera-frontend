import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CameraInformation } from "./CameraDetailsPage";
import { getCameraList } from "../../Functions/Api";
import { Color } from "../Constants";
import Header from "../Header";
import CameraButton from "../CameraButton";
import VerticalSpacing from "../VerticalSpacing";

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
`;

const CameraListContainer = styled.div`
  width: 30rem;
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

  return (
    <Page>
      <Header />
      <InnerPage>
        <VerticalSpacing height={8} />
        <CameraListContainer>
          {cameras.map((camera, index) => (
            <div>
              <CameraButton
                key={index}
                onClick={() => onSelectedCamera(camera)}
                camera={camera}
              />
              <VerticalSpacing height={1} />
            </div>
          ))}
        </CameraListContainer>
      </InnerPage>
    </Page>
  );
}

export default StartPage;

import React, { useState } from "react";
import styled from "styled-components";
import CameraDetailsPage, {
  CameraInformation,
} from "./Components/Pages/CameraDetailsPage";
import StartPage from "./Components/Pages/StartPage";
import { Color } from "./Components/Constants";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${Color.Height0};
  font-family: "Jost";
`;

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedCamera, setSelectedCamera] =
    useState<CameraInformation | null>(null);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <Container>
      {selectedCamera ? (
        <CameraDetailsPage
          camera={selectedCamera}
          onClosedDetailsView={() => {
            setSelectedCamera(null);
          }}
        />
      ) : (
        <StartPage
          onSelectedCamera={(selectedCamera) => {
            setSelectedCamera(selectedCamera);
          }}
          onLogin={() => { }}
        />
      )}
    </Container>
  );
}

export default App;

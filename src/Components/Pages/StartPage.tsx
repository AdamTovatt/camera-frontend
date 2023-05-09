import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CameraInformation } from "./CameraDetailsPage";
import { getCameraList } from "../../Functions/Api";
import { Color } from "../Constants";
import Header from "../Header";

const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${Color.White};
  border-radius: 5px;
  padding: 20px;
`;

const Button = styled.button`
  width: 10rem;
  height: 3rem;
  background: ${Color.Height2};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  outline: none;
  border: none;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

function StartPage({
  onLogin,
  onSelectedCamera,
}: {
  onLogin: () => void;
  onSelectedCamera: (camera: CameraInformation) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cameras, setCameras] = useState<CameraInformation[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin();
  };

  useEffect(() => {
    getCameraList().then((data) => {
      console.log(data);
      setCameras(data);
    });
  }, []);

  return (
    <Page>
      <Header />
      <Form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <Button type="submit">Login</Button>
      </Form>
      <ButtonContainer>
        {cameras.map((camera, index) => (
          <Button key={index} onClick={() => onSelectedCamera(camera)}>
            Camera {camera.id}
          </Button>
        ))}
      </ButtonContainer>

    </Page>
  );
}

export default StartPage;

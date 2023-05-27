import styled from "styled-components";
import { Color } from "./Constants";
import { Maximize2, Tv, VideoOff } from "react-feather";
import { CameraInformation } from "./Pages/CameraDetailsPage";
import VerticalSpacing from "./VerticalSpacing";
import IconButton from "./IconButton";
import { useEffect, useRef, useState } from "react";
import { initializeConnection, sendJsonMessage } from "../Functions/WebSockets";

const MainContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const Image = styled.img<{ fullScreen: boolean; landScapeMode: boolean }>`
  max-width: ${(props) => (props.fullScreen ? "unset" : "100%")};

  width: ${(props) =>
    props.fullScreen && !props.landScapeMode ? "100vw" : "unset"};
  height: ${(props) =>
    props.fullScreen && props.landScapeMode ? "100vh" : "unset"};
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

function WebSocketStream({
  camera,
  fullScreen,
  onConnectionEstablished,
}: {
  camera: CameraInformation;
  fullScreen: boolean;
  onConnectionEstablished: (webSocket: WebSocket) => void;
}) {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const [landScapeMode, setLandscapeMode] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      setLandscapeMode(innerWidth > innerHeight);
    };

    // Initial check on component mount
    handleResize();

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Create a WebSocket connection
    webSocketRef.current = new WebSocket(
      "wss://sakurapi.se/camera-server/video-output-stream"
      //"ws://localhost:5000/video-output-stream"
    );

    // Clean up the WebSocket connection on unmount
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!webSocketRef.current) return;

    // send an initial message with the camera.id when the WebSocket is open
    const onOpen = () => {
      if (!webSocketRef.current) return;

      initializeConnection(webSocketRef.current, "fake token", camera.id);

      onConnectionEstablished(webSocketRef.current);
    };

    const onError = (event: Event) => {
      console.log("error in websocket:", event);
    };

    const onClose = (event: CloseEvent) => {
      console.log("websocket was closed", event);
    };

    // bind events
    webSocketRef.current.addEventListener("open", onOpen);
    webSocketRef.current.addEventListener("error", onError);
    webSocketRef.current.addEventListener("close", onClose);

    // handle received data from the WebSocket
    const onMessage = (event: MessageEvent) => {
      const data = event.data; // Received data as a byte array

      // Create a Blob from the byte array
      const blob = new Blob([data], { type: "image/jpeg" });

      if (blob.size === 0) return;

      const url = URL.createObjectURL(blob);

      const previousSource = imageSource;

      // Create an object URL for the Blob
      setImageSource(url);

      // Clean up the object URL
      if (previousSource) URL.revokeObjectURL(previousSource);
    };

    webSocketRef.current.addEventListener("message", onMessage);

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.removeEventListener("open", onOpen);
        webSocketRef.current.removeEventListener("message", onMessage);
        webSocketRef.current.removeEventListener("error", onError);
        webSocketRef.current.removeEventListener("close", onClose);
      }
    };
  }, [imageSource, camera.id]);

  return (
    <MainContainer>
      {imageSource ? (
        <Image
          src={imageSource}
          fullScreen={fullScreen}
          landScapeMode={landScapeMode}
        />
      ) : (
        <ImagePlaceHolder>
          <Tv size={128} strokeWidth={1} />
          Loading camera...
        </ImagePlaceHolder>
      )}
    </MainContainer>
  );
}

export default WebSocketStream;

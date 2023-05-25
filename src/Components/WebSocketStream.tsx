import styled from "styled-components";
import { Color } from "./Constants";
import { Maximize2, Tv, VideoOff } from "react-feather";
import { CameraInformation } from "./Pages/CameraDetailsPage";
import VerticalSpacing from "./VerticalSpacing";
import IconButton from "./IconButton";
import { useEffect, useRef, useState } from "react";

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

const FullScreenVideo = styled.img`
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

function WebSocketStream({ camera }: { camera: CameraInformation }) {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [previousImageSource, setPreviousImageSource] = useState<string | null>(
    null
  );
  const webSocketRef = useRef<WebSocket | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Create a WebSocket connection
    webSocketRef.current = new WebSocket(
      "wss://sakurapi.se/camera-server/video-output-stream"
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
      webSocketRef.current?.send(new Uint8Array([camera.id])); // send the camera id
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
        <Image src={imageSource} />
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

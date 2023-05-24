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

const Video = styled.video`
  max-width: 100%;
`;

const FullScreenVideo = styled.video`
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

function VideoWindow({
    camera
}: {
    camera: CameraInformation;
}) {
    const [isOnBVideo, setIsOnBVideo] = useState(false);
    const [hasBVideo, setHasBVideo] = useState(true);
    const [hasAVideo, setHasAVideo] = useState(true);
    const [cameraIsOnline, setCameraIsOnline] = useState(true);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);
  const videoFullScreenRef = useRef<HTMLVideoElement>(null);

  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create a WebSocket connection
    webSocketRef.current = new WebSocket(
      "ws://localhost:5000/video-output-stream"
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

    // Send an initial message with the value 1 when the WebSocket is open
    const onOpen = () => {
      webSocketRef.current?.send(new Uint8Array([1])); // send the camera id
    };

    const onError = (event: Event) => {
      console.log("error", event);
    };

    const onClose = (event: CloseEvent) => {
      console.log("close", event);
    };

    webSocketRef.current.addEventListener("open", onOpen);
    webSocketRef.current.addEventListener("error", onError);
    webSocketRef.current.addEventListener("close", onClose);

    // Handle received data from the WebSocket
    const onMessage = (event: MessageEvent) => {
      const data = event.data; // Received data as a byte array

      // Create a Blob from the byte array
      const blob = new Blob([data], { type: "video/mp4" });

      // Create an object URL for the Blob
      const videoUrl = URL.createObjectURL(blob);
      console.log(videoUrl);

      console.log("is on b video:" + isOnBVideo);

      // Set the video source to the object URL
      if(isOnBVideo) {
        console.log("will set A video");
      if (videoRefA.current) {
        const savedPreviousImageUrl = videoRefA.current.src;
        videoRefA.current.src = videoUrl;
        setHasAVideo(true);
              // Clean up the object URL
      URL.revokeObjectURL(savedPreviousImageUrl);
      setIsOnBVideo(false);
      }
    }
    else {
      console.log("will set B video, " + videoRefB.current);
      if (videoRefB.current) {
        const savedPreviousImageUrl = videoRefB.current.src;
        videoRefB.current.src = videoUrl;
        setHasBVideo(true);
        // Clean up the object URL
        URL.revokeObjectURL(savedPreviousImageUrl);
        setIsOnBVideo(true);
      }
    }
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
  }, [isOnBVideo]);

  return (
    <MainContainer>
      <ImageContainer>
        {hasAVideo && hasBVideo ? (
          <>
            {cameraIsOnline ? (
              <>
                {isFullScreen ? (
                  <FullScreenImageContainer
                    onClick={() => {
                      setIsFullScreen(false);
                    }}
                  >
                    <FullScreenVideo ref={videoFullScreenRef} />
                  </FullScreenImageContainer>
                ) : (<>
                  <Video ref={videoRefB} controls={false} autoPlay />
                    <Video ref={videoRefA} controls={false} autoPlay />
                
                  </>  
                )}
              </>
            ) : (
              <ImagePlaceHolder>
                <VideoOff size={128} strokeWidth={1} />
                Camera is offline
              </ImagePlaceHolder>
            )}
          </>
        ) : (
          <ImagePlaceHolder>
            <Tv size={128} strokeWidth={1} />
            Loading camera...
          </ImagePlaceHolder>
        )}
        <VerticalSpacing />
        <ImageContainerBottomRow>
          <ActiveText>No text</ActiveText>
          <IconButton
            icon={<Maximize2 color={Color.White} />}
            onClick={() => {
              setIsFullScreen(true);
            }}
          />
        </ImageContainerBottomRow>
      </ImageContainer>
    </MainContainer>
  );
}

function GetCameraStatus({ lastDate }: { lastDate: Date }): string {
  const timeSinceActive = (new Date().getTime() - lastDate.getTime()) / 1000; // 1000 = 1 second in milliseconds (we want to convert to seconds)

  if (timeSinceActive < 10) return "(Live view)";
  if (timeSinceActive < 120) return timeSinceActive + " seconds ago";
  if (timeSinceActive < 3600)
    return Math.floor(timeSinceActive / 60) + " minutes ago";

  return "Last active: " + new Date(lastDate).toLocaleString();
}

export default VideoWindow;

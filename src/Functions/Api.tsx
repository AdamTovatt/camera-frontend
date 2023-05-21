import { CameraInformation } from "../Components/Pages/CameraDetailsPage";
import React from "react";
import axios from "axios";

interface MoveCameraParams {
  cameraId: number;
  pitch: number;
  yaw: number;
}

export const moveCamera = async (
  cameraId: number,
  pitch: number,
  yaw: number
): Promise<void> => {
  const url = "https://sakurapi.se/camera-server/camera/move";

  const body: MoveCameraParams = {
    cameraId,
    pitch,
    yaw,
  };

  try {
    const response = await axios.post(url, body);
    console.log("Move camera response:", response.data);
  } catch (error) {
    console.error("Error moving camera:", error);
  }
};

export async function getCameraList(): Promise<CameraInformation[]> {
  const response = await fetch(
    process.env.REACT_APP_API_ENDPOINT_URL + "/camera/list"
  );
  return await response.json();
}

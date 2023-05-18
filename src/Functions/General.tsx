import { Color } from "../Components/Constants";
import { CameraInformation } from "../Components/Pages/CameraDetailsPage";

export function GetCameraStatusColor({
    camera,
  }: {
    camera: CameraInformation;
  }): string {
    const timeSinceActive =
      (new Date().getTime() - new Date(camera.lastActive).getTime()) / 3600000; // 3600000 = 1 hour in milliseconds (we want to convert to hours)
    if (timeSinceActive > 1) return Color.Negative;
    else if (timeSinceActive > 0.1) return Color.Warning;
    else return Color.Positive;
  }
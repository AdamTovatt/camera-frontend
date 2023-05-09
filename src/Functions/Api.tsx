import { CameraInformation } from "../Components/Pages/CameraDetailsPage";

export async function getCameraList() : Promise<CameraInformation[]> {
    const response = await fetch(process.env.REACT_APP_API_ENDPOINT_URL + '/camera/list');
    return await response.json();
}
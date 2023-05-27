export function sendJsonMessage(webSocket: WebSocket, message: any) {
  const messageBuffer = new TextEncoder().encode(JSON.stringify(message));

  const combinedBuffer = new ArrayBuffer(4 + messageBuffer.byteLength);
  const combinedView = new Uint8Array(combinedBuffer);
  combinedView.set(new Uint8Array(messageBuffer), 4);

  const lengthView = new DataView(combinedBuffer, 0, 4);
  lengthView.setInt32(0, messageBuffer.byteLength, true);

  webSocket.send(combinedBuffer);
}

export function initializeConnection(
  webSocket: WebSocket,
  token: string,
  cameraId: number
) {
  sendJsonMessage(webSocket, { token, cameraId });
}

export function sendMoveMessage(
  webSocket: WebSocket,
  moveX: number,
  moveY: number
): void {
  const moveInfoType = 1; // MoveInformation type value (this is an enum in the back end)

  const buffer = new ArrayBuffer(12); // Total buffer size: 4 bytes (type) + 4 bytes (moveX) + 4 bytes (moveY)
  const view = new DataView(buffer);

  // Write MoveInformation type
  view.setInt32(0, moveInfoType, true);

  // Write moveX value
  view.setFloat32(4, moveX, false);

  // Write moveY value
  view.setFloat32(8, moveY, false);

  webSocket.send(buffer);
}

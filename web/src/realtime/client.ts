import { fetchClientSecret } from "../utils/api";

export interface RealtimeConnection {
  pc: RTCPeerConnection;
  dc: RTCDataChannel;
  audio: HTMLAudioElement;
  close: () => void;
  sendEvent: (payload: Record<string, unknown>) => void;
}

export async function startRealtime(onEvent: (event: any) => void): Promise<RealtimeConnection> {
  const { client_secret } = await fetchClientSecret();
  const pc = new RTCPeerConnection();
  const dc = pc.createDataChannel("oai-events");
  dc.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      onEvent(payload);
    } catch (error) {
      console.error("[realtime] failed to parse event", error);
    }
  };

  const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
  mic.getTracks().forEach((track) => pc.addTrack(track, mic));

  const audio = new Audio();
  audio.autoplay = true;
  pc.ontrack = (event) => {
    audio.srcObject = event.streams[0];
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const response = await fetch("https://api.openai.com/v1/realtime/calls", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${client_secret.value}`,
      "Content-Type": "application/sdp"
    },
    body: offer.sdp ?? ""
  });

  if (!response.ok) {
    throw new Error(`Failed to create realtime call: ${await response.text()}`);
  }

  const answerSdp = await response.text();
  await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

  const close = () => {
    dc.close();
    pc.close();
    mic.getTracks().forEach((track) => track.stop());
    if (audio.srcObject instanceof MediaStream) {
      audio.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const sendEvent = (payload: Record<string, unknown>) => {
    if (dc.readyState === "open") {
      dc.send(JSON.stringify(payload));
    }
  };

  return { pc, dc, audio, close, sendEvent };
}

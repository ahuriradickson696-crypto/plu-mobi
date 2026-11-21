import api from "../api/client";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export async function subscribeToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    alert("Push not supported in this browser");
    return false;
  }

  const perm = await Notification.requestPermission();
  if (perm !== "granted") {
    alert("Notification permission denied");
    return false;
  }

  const reg = await navigator.serviceWorker.ready;
  const { data } = await api.get("/push/public-key");
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(data.publicKey),
  });

  await api.post("/push/subscribe", { subscription: sub.toJSON() });
  return true;
}

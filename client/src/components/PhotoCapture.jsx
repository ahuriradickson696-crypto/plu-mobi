/**
 * PhotoCapture - file picker with mobile camera support.
 * Resizes to 512x512, strips EXIF, returns compressed File.
 */
import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";

export default function PhotoCapture({ onChange, label = "Photo", hint, required = false }) {
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function handleFile(e) {
    setError("");
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.type.indexOf("image/") !== 0) { setError("Please choose an image file."); return; }
    setBusy(true);
    try {
      const compressed = await imageCompression(file, {
        maxWidthOrHeight: 512,
        initialQuality: 0.82,
        useWebWorker: true,
        fileType: "image/jpeg",
      });
      const renamed = new File([compressed], "photo_" + Date.now() + ".jpg", { type: "image/jpeg" });
      const url = URL.createObjectURL(renamed);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(url);
      if (onChange) onChange(renamed);
    } catch (err) {
      setError(err.message || "Could not process photo.");
      if (onChange) onChange(null);
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    if (onChange) onChange(null);
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold text-plu-black">
        {label}
        {required && <span className="text-plu-red ml-1" aria-hidden>*</span>}
      </span>
      {hint && <p className="text-xs text-plu-slate">{hint}</p>}
      <div className="flex items-center gap-3">
        {preview ? (
          <img src={preview} alt="Selected photo preview" className="w-20 h-20 rounded-full object-cover border-2 border-plu-yellow" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-plu-black/5 border-2 border-dashed border-plu-black/20 flex items-center justify-center text-xs text-plu-slate text-center px-1">Required</div>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="photo-input" className={"inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer focus-within:ring-4 focus-within:ring-plu-yellow/60 " + (busy ? "bg-plu-black/20 text-plu-black/50 pointer-events-none" : "bg-plu-yellow text-plu-black hover:brightness-95")}>
            {busy ? "Processing..." : (preview ? "Change photo" : "Add photo")}
            <input id="photo-input" ref={inputRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="sr-only" />
          </label>
          {preview && (
            <button type="button" onClick={clear} className="text-xs underline text-plu-slate hover:text-plu-black text-left">Remove photo</button>
          )}
        </div>
      </div>
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

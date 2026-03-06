// src/components/MediaUploadSection.jsx
import { useState, useRef } from "react";

const MAX_IMAGES = 2;
const MAX_VIDEOS = 1;

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
);

const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

export default function MediaUploadSection({ data, onChange }) {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(null); // 'image' | 'video' | null

  const images = data.images || [];
  const videos = data.videos || [];

  const handleImageFiles = (files) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const valid = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining);
    const newPreviews = valid.map((f) => ({ file: f, url: URL.createObjectURL(f), name: f.name }));
    onChange("images", [...images, ...newPreviews]);
  };

  const handleVideoFile = (files) => {
    if (videos.length >= MAX_VIDEOS) return;
    const valid = Array.from(files).find((f) => f.type.startsWith("video/"));
    if (!valid) return;
    const preview = { file: valid, url: URL.createObjectURL(valid), name: valid.name };
    onChange("videos", [preview]);
  };

  const removeImage = (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    onChange("images", updated);
  };

  const removeVideo = () => onChange("videos", []);

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver(null);
    if (type === "image") handleImageFiles(e.dataTransfer.files);
    else handleVideoFile(e.dataTransfer.files);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
      <h2 className="text-base font-semibold text-gray-900 mb-1 pb-3 border-b border-gray-100">
        Media
      </h2>
      <p className="text-xs text-gray-400 mt-3 mb-5">Upload up to {MAX_IMAGES} images and {MAX_VIDEOS} video for your listing.</p>

      <div className="grid grid-cols-2 gap-4">
        {/* ── Images Upload ── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <ImageIcon /> Photos <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-400">{images.length}/{MAX_IMAGES}</span>
          </div>

          {/* Drop zone */}
          {images.length < MAX_IMAGES && (
            <div
              onClick={() => imageInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver("image"); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, "image")}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition
                ${dragOver === "image" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/40"}`}
            >
              <div className={`text-gray-400 transition ${dragOver === "image" ? "text-blue-500 scale-110" : ""}`}>
                <UploadIcon />
              </div>
              <p className="text-xs text-gray-500 text-center">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag & drop
              </p>
              <p className="text-[11px] text-gray-400">PNG, JPG, WEBP</p>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageFiles(e.target.files)}
              />
            </div>
          )}

          {/* Image previews */}
          {images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative group w-[calc(50%-4px)] aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="opacity-0 group-hover:opacity-100 transition bg-red-500 text-white rounded-full p-1.5 shadow"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">Cover</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Video Upload ── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <VideoIcon /> Video <span className="text-xs text-gray-400 font-normal">(Optional)</span>
            </label>
            <span className="text-xs text-gray-400">{videos.length}/{MAX_VIDEOS}</span>
          </div>

          {videos.length < MAX_VIDEOS && (
            <div
              onClick={() => videoInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver("video"); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, "video")}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition
                ${dragOver === "video" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/40"}`}
            >
              <div className={`text-gray-400 transition ${dragOver === "video" ? "text-blue-500 scale-110" : ""}`}>
                <UploadIcon />
              </div>
              <p className="text-xs text-gray-500 text-center">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag & drop
              </p>
              <p className="text-[11px] text-gray-400">MP4, MOV, AVI</p>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleVideoFile(e.target.files)}
              />
            </div>
          )}

          {/* Video preview */}
          {videos.length > 0 && (
            <div className="mt-3">
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video">
                <video src={videos[0].url} className="w-full h-full object-cover" controls />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition"
                >
                  <TrashIcon />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5 truncate">{videos[0].name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
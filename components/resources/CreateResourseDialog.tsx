"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { extractYoutubeData } from "@/lib/utils/youTube"


export const CreateResourceDialog = ({
  projectId,
  setResources,
}: {
  projectId: string;
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
}) => {
  
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("youtube_video");
  const [file, setFile] = useState<File | null>(null); // ✅ FIX

  const handleSubmit = async () => {
    try {
      let res;

      // 🔥 PDF CASE
      if (type === "pdf") {
        if (!file) {
          toast.error("Please upload a PDF");
          return;
        }
        
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        res = await axios.post(
          `/api/projects/${projectId}/resources`,
          formData,
        );
      } else {
        // 🔥 VIDEO / PLAYLIST
        const youTubeData = extractYoutubeData(url);
        const finalType = youTubeData.playlistId
          ? "youtube_playlist"
          : "youtube_video";
        res = await axios.post(`/api/projects/${projectId}/resources`, {
          title,
          url,
          type:finalType,
        });
      }

      const newResource = res.data.data;

      // ✅ optimistic update
      setResources((prev: Resource[]) => [newResource, ...prev]);

      toast.success("Resource added");

      // reset
      setOpen(false);
      setTitle("");
      setUrl("");
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add resource");
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="blue-btn">
        + Add Resource
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-100 space-y-4">
            <h2 className="text-lg font-semibold">Add Resource</h2>

            {/* TYPE */}
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setUrl("");
                setFile(null);
              }}
              className="w-full p-2 bg-neutral-800 rounded"
            >
              <option value="youtube_video">YouTube Video</option>
              <option value="youtube_playlist">Playlist</option>
              <option value="pdf">PDF</option>
            </select>

            {/* TITLE */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-2 bg-neutral-800 rounded"
            />

            {/* 🔥 CONDITIONAL INPUT */}
            {type === "pdf" ? (
              <label
                htmlFor="pdfUpload"
                className="block border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-white/40 transition"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files?.[0];

                  if (droppedFile && droppedFile.type === "application/pdf") {
                    setFile(droppedFile);
                  } else {
                    toast.error("Only PDF allowed");
                  }
                }}
              >
                {file ? (
                  <div className="space-y-1">
                    <p className="text-green-400 font-medium">📄 {file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400">
                    Drag & drop PDF here or{" "}
                    <span className="underline">click to upload</span>
                  </p>
                )}

                <input
                  id="pdfUpload"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (
                      selectedFile &&
                      selectedFile.type === "application/pdf"
                    ) {
                      setFile(selectedFile);
                    } else {
                      toast.error("Only PDF allowed");
                    }
                  }}
                />
              </label>
            ) : (
              <input
                value={url || ""}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="YouTube URL"
                className="w-full p-2 bg-neutral-800 rounded"
              />
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} className="bg-red-500 hover:bg-red-600">
                Cancel
              </Button>

              <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

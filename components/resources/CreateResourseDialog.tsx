"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { extractYoutubeData } from "@/lib/utils/youTube";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

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

  const handleSubmit = async () => {
    try {
      let res;

      
      if (type === "pdf") {
        if (!url) {
          toast.error("Please upload PDF first");
          return;
        }

        res = await axios.post(`/api/projects/${projectId}/resources`, {
          title,
          fileUrl: url, 
          type: "pdf",
        });
      } else {
        // 🔥 VIDEO / PLAYLIST
        const youTubeData = extractYoutubeData(url);
        const finalType = youTubeData.playlistId
          ? "youtube_playlist"
          : "youtube_video";

        res = await axios.post(`/api/projects/${projectId}/resources`, {
          title,
          url,
          type: finalType,
        });
      }

      const newResource = res.data.data;

      //  optimistic update
      setResources((prev: Resource[]) => [newResource, ...prev]);

      toast.success("Resource added");

      // reset
      setOpen(false);
      setTitle("");
      setUrl("");
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
              <div className="space-y-2">
                <UploadButton<OurFileRouter>
                  endpoint="resourceUploader"
                  onClientUploadComplete={(res) => {
                   

                    const file = res[0];

                   

                    setUrl(file?.url); // store URL

                    toast.success("PDF uploaded");
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(error.message);
                  }}
                />

               
              </div>
            ) : (
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="YouTube URL"
                className="w-full p-2 bg-neutral-800 rounded"
              />
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                className="bg-red-500 hover:bg-red-600"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

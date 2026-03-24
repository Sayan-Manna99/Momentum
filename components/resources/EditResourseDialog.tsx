"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";



export const EditResourceDialog = ({
  resource,
  open,
  setOpen,
  setResources,
}: {
  resource: Resource;
  open: boolean;
  setOpen: (v: boolean) => void;
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
}) => {
  const [title, setTitle] = useState(resource.title);
  const [url, setUrl] = useState(resource.url || "");

  const handleEdit = async () => {
    try {
      const payload: any = { title };

      if (resource.type !== "pdf") {
        payload.url = url;
      }

      const res = await axios.patch(`/api/resources/${resource._id}`, payload);

      const updated = res.data.data;

      //  update UI
      setResources((prev) =>
        prev.map((r) => (r._id === resource._id ? updated : r)),
      );

      toast.success("Resource updated");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-xl w-[400px] space-y-4">
        <h2 className="text-lg font-semibold">Edit Resource</h2>

        {/* TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-neutral-800 rounded"
          placeholder="Title"
        />

        {/* URL */}
        {resource.type !== "pdf" ? (
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2 bg-neutral-800 rounded"
            placeholder="URL"
          />
        ) : (
          <p className="text-xs text-gray-500">PDF URL cannot be changed</p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)} className="bg-red-500">
            Cancel
          </Button>
          <Button onClick={handleEdit} className="bg-blue-500">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

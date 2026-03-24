"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export const useProjectDetails = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const [projectRes, resourceRes] = await Promise.all([
          axios.get(`/api/projects/${projectId}`),
          axios.get(`/api/projects/${projectId}/resources`),
        ]);
   
        setProject(projectRes.data.data);
        setResources(resourceRes.data.data);
        console.log(resourceRes.data)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return {
    project,
    resources,
    loading,
    setResources,
  };
};

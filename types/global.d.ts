declare global {
  type WelcomeEmailData = {
    email: string;
    name: string;
    intro: string;
    dashboardUrl: string;
  };
  type WeeklyReportEmailData = {
    email: string;
    name: string;
    totalProjects: number;
    completedProjects: number;
    progress: number;
    dashboardUrl: string;
    aiMessage: string;
  };

  type FormInputProps = {
    name: string;
    label: string;
    placeholder: string;
    type?: string;
    register: UseFormRegister;
    error?: FieldError;
    validation?: RegisterOptions;
    disabled?: boolean;
    value?: string;
    className?: string;
  };
  type FooterLinkProps = {
    text: string;
    linkText: string;
    href: string;
  };
  type User = {
    id: string;
    email: string;
    name: string;
  };
  type SignUpFormData = {
    name: string;
    email: string;
    password: string;
  };
  type SignInFormData = {
    email: string;
    password: string;
  };
  type ResourceHandler = (
    userId: string,
    projectId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>;
  type CreatePlaylistResourceData = {
    title: string;
    url: string;
    videoCount?: number;
    tags?: string[];
  };
type PdfProgressInput = {
  currentPage: number;
};
  type PlaylistProgressInput = {
    videoId: string;
    position: number;
    duration: number;
  };
  type VideoProgressItem = {
    videoId: string;
    duration: number;
    watchedDuration: number;
    lastPosition: number;
    completed: boolean;
    lastWatchedAt?: Date;
  };

  

  type VideoProgressInput = {
    position: number;
  };

  type PlaylistProgressInput = {
    videoId: string;
    position: number;
    duration: number;
  };

  type PdfProgressInput = {
    pagesRead: number;
    lastPageRead: number;
  };

  type UpdateProgressInput =
    | { type: ResourceType.YOUTUBE_VIDEO; data: VideoProgressInput }
    | { type: ResourceType.YOUTUBE_PLAYLIST; data: PlaylistProgressInput }
    | { type: ResourceType.PDF; data: PdfProgressInput };

  type Project = {
    _id: string;
    userId: string;

    title: string;
    description?: string;

    tags: string[];
    color: string;

    status: "planning" | "in_progress" | "on_hold" | "completed" | "archived";

    order: number;
    isPinned: boolean;
    isFavorite: boolean;

    targetEndDate: string | null;

    createdAt: string;
    updatedAt: string;

    stats: {
      totalResources: number;
      completedResources: number;
      progressPercentage: number;
  };

  resourceStats: {
    video: number;
    playlist: number;
    pdf: number;
  };

  isOverdue: boolean;
};

  type FormData = {
    title: string;
    description?: string;
    targetEndDate?: string;
  };

  type YoutubeVideoData = {
    videoId: string;
  };


  type YoutubePlaylistData = {
    playlistId: string;
    videos: {
      videoId: string;
      duration:number
    }[];
  };
  type Resource = {
    _id: string;
    projectId: string;
    title: string;
    type: "youtube_video" | "youtube_playlist" | "pdf";

    url?: string;
    totalDuration?: number;

    youtubeData?: YoutubeVideoData | YoutubePlaylistData;

    pdfData?: {
      pageCount?: number;
    };

    progressPercentage?: number;
  };
}
export {};

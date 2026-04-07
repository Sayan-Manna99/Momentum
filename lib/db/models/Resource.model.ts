import  { Schema, model, models } from "mongoose";

export enum ResourceType {
  YOUTUBE_VIDEO = "youtube_video",
  YOUTUBE_PLAYLIST = "youtube_playlist",
  PDF = "pdf",
}

export enum ResourceStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
  DRAFT = "draft",
}

const ResourceSchema = new Schema(
  {
    // Owner
    userId: {
      type: String,
      required: true,
      index: true,
    },

    // Project Association
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      index: true,
      required: true,
    },

    // Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // Type & Status
    type: {
      type: String,
      enum: Object.values(ResourceType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ResourceStatus),
      default: ResourceStatus.ACTIVE,
    },

    // YouTube Specific Data
    youtubeData: {
      videoId: String,
      playlistId: String,
      videos: [
        {
          videoId: String,
          duration: Number,
        },
      ],
      channelId: String,
      channelTitle: String,
      title: String,
      thumbnailUrl: String,
      duration: Number,
      publishedAt: Date,
    },
    // For playlists
    videoCount: Number,

    // PDF Specific Data
    fileUrl: String,
    pdfData: {
     
      fileSize: Number, // in bytes
      pageCount: Number,
      fileName: String,
      mimeType: String,
    },

    // Classification
    tags: [String],

    // Metadata

    contentLength: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    // User Interaction
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    notes: {
      type: String,
      maxlength: 5000,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },

    // Order within project
    order: {
      type: Number,
      default: 0,
    },

    // Access tracking
    lastAccessedAt: Date,
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { versionKey: false },
    toObject: { versionKey: false },
    timestamps: true,
  },
);

// Indexes

ResourceSchema.index({ userId: 1, createdAt: -1 });
ResourceSchema.index({ userId: 1, projectId: 1, order: 1 });
ResourceSchema.index({ userId: 1, type: 1 });
ResourceSchema.index({ userId: 1, status: 1 });
ResourceSchema.index({ userId: 1, isFavorite: -1 });
ResourceSchema.index({ "youtubeData.videoId": 1 });
ResourceSchema.index({ "youtubeData.playlistId": 1 });


// Method to increment access count
ResourceSchema.methods.recordAccess = async function () {
  this.accessCount += 1;
  this.lastAccessedAt = new Date();
  await this.save();
};

const Resource = models.Resource || model("Resource", ResourceSchema);

export default Resource;

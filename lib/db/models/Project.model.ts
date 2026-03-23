import  { Schema, model, models } from "mongoose";

export enum ProjectStatus {
  PLANNING = "planning",
  IN_PROGRESS = "in_progress",
 
  COMPLETED = "completed",
  ARCHIVED = "archived",
}




const ProjectSchema = new Schema(
  {
    // Owner
    userId: {
      type: String,
      required: true,
      index: true,
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

    // Project Classification
  
    tags: [String],
  

    // Visual
    coverImage: {
      type: String, // URL to cover image
    },
    color: {
      type: String, // Hex color for project card
      default: "#3B82F6",
    },

    // Status & Progress
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.PLANNING,
    },

    // Goals & Targets
    goals: [
      {
        title: String,
        description: String,
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: Date,
      },
    ],

    // Timeline
    startDate: Date,
    targetEndDate: Date,
    actualEndDate: Date,

   
    // Statistics (calculated)
    stats: {
      totalResources: {
        type: Number,
        default: 0,
      },
      completedResources: {
        type: Number,
        default: 0,
      },
      totalDuration: {
        type: Number, // in seconds
        default: 0,
      },
      completedDuration: {
        type: Number, // in seconds
        default: 0,
      },
      progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },

    // Time Tracking
   
    lastAccessedAt: Date,

    // Notes
    notes: {
      type: String,
      maxlength: 5000,
    },

    // Order/Priority
    order: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
ProjectSchema.index({ userId: 1, createdAt: -1 });
ProjectSchema.index({ userId: 1, status: 1 });

ProjectSchema.index({ userId: 1, isPinned: -1, order: 1 });

// Virtual for completion status
ProjectSchema.virtual("isCompleted").get(function () {
  return this.status === ProjectStatus.COMPLETED;
});
// Virtual for overdue status
ProjectSchema.virtual("isOverdue").get(function () {
  if (!this.targetEndDate) return false;
  return new Date() > this.targetEndDate && this.status !== "completed";
});
// Method to update stats
ProjectSchema.methods.updateStats = async function () {
  const Resource = models.Resource || model("Resource");
  const Progress = models.Progress || model("Progress");

  // Get all resources linked to this project
  const resources = await Resource.find({
    projectId: this._id,
  });

  // Get progress for those resources
  const progressList = await Progress.find({
    userId: this.userId,
    resourceId: { $in: resources.map((r) => r._id) },
  });

  const totalResources = resources.length;

  const completedResources = progressList.filter(
    (p) => p.status === "completed"
  ).length;

  const totalDuration = resources.reduce(
    (sum, r) => sum + (r.totalDuration || 0),
    0
  );

  const completedDuration = progressList.reduce(
    (sum, p) => sum + (p.watchedDuration || 0),
    0
  );

  const progressPercentage =
    totalResources > 0
      ? (completedResources / totalResources) * 100
      : 0;

  this.stats = {
    totalResources,
    completedResources,
    totalDuration,
    completedDuration,
    progressPercentage: Math.round(progressPercentage),
  };

  await this.save();
};
const Project = models.Project || model("Project", ProjectSchema);

export default Project;

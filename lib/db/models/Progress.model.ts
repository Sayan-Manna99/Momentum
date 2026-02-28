import mongoose, { Schema, model, models } from "mongoose";

export enum ProgressStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

const ProgressSchema = new Schema(
  {
    // References
    userId: {
      type: String,
      required: true,
      index: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      index: true,
      default: null,
    },

    // Status
    status: {
      type: String,
      enum: Object.values(ProgressStatus),
      default: ProgressStatus.NOT_STARTED,
    },
    
    // Video Progress
    watchedDuration: {
      type: Number,
      default: 0, // in seconds
    },
    lastWatchedPosition: {
      type: Number,
      default: 0, // in seconds
    },
    watchCount: {
      type: Number,
      default: 0,
    },
    
    // Playlist Progress
    completedVideos: [String], // Array of videoIds
    videoProgress: [
      {
        videoId: String,
        watchedDuration: Number,
        lastPosition: Number,
        completed: Boolean,
        lastWatchedAt: Date,
      },
    ],

    // PDF Progress
    pagesRead: [Number], // Array of page numbers
    lastPageRead: {
      type: Number,
      default: 0,
    },
    bookmarks: [
      {
        page: Number,
        note: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Article Progress
    scrollPosition: {
      type: Number,
      default: 0, // percentage
    },

    // Calculated Progress
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Time Tracking
    totalTimeSpent: {
      type: Number, // in seconds
      default: 0,
    },
    sessions: [
      {
        startTime: Date,
        endTime: Date,
        duration: Number, // in seconds
      },
    ],

    // Milestones
    startedAt: Date,
    completedAt: Date,
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },

    // Notes & Rating
    notes: {
      type: String,
      maxlength: 2000,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },

    // Streaks
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: Date,
  },
  {
    timestamps: true,
  }
);

// Compound index for unique user-resource combination
ProgressSchema.index({ userId: 1, resourceId: 1 }, { unique: true });
ProgressSchema.index({ userId: 1, status: 1 });
ProgressSchema.index({ userId: 1, projectId: 1 });
ProgressSchema.index({ userId: 1, lastAccessedAt: -1 });

// Method to start a new session
ProgressSchema.methods.startSession = async function () {
  this.sessions.push({
    startTime: new Date(),
  });
  
  if (!this.startedAt) {
    this.startedAt = new Date();
    this.status = ProgressStatus.IN_PROGRESS;
  }
  
  await this.save();
  return this.sessions[this.sessions.length - 1];
};

// Method to end current session
ProgressSchema.methods.endSession = async function () {
  const currentSession = this.sessions[this.sessions.length - 1];
  
  if (currentSession && !currentSession.endTime) {
    currentSession.endTime = new Date();
    currentSession.duration = Math.floor(
      (currentSession.endTime.getTime() - currentSession.startTime.getTime()) / 1000
    );
    
    this.totalTimeSpent += currentSession.duration;
  }
  
  this.lastAccessedAt = new Date();
  await this.save();
};

// Method to update streak
ProgressSchema.methods.updateStreak = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActivity = this.lastActivityDate
    ? new Date(this.lastActivityDate)
    : null;
  
  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysDiff === 0) {
      // Same day, no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day
      this.currentStreak += 1;
      if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
      }
    } else {
      // Streak broken
      this.currentStreak = 1;
    }
  } else {
    this.currentStreak = 1;
  }
  
  this.lastActivityDate = new Date();
  await this.save();
};

const Progress = models.Progress || model("Progress", ProgressSchema);

export default Progress;




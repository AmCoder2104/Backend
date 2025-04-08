import mongoose from "mongoose"

const TestAttemptSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  score: {
    type: Number,
    default: 0,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
      selectedOption: {
        type: Number,
      },
      isCorrect: {
        type: Boolean,
      },
    },
  ],
  status: {
    type: String,
    enum: ["in-progress", "completed", "abandoned"],
    default: "in-progress",
  },
  ipAddress: {
    type: String,
  },
  device: {
    type: String,
  },
  browser: {
    type: String,
  },
  suspiciousActivities: [
    {
      type: {
        type: String,
        enum: ["tab-switch", "multiple-login", "copy-paste", "other"],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      details: {
        type: String,
      },
    },
  ],
})

export default mongoose.models.TestAttempt || mongoose.model("TestAttempt", TestAttemptSchema)


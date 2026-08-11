import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    due_time: { type: Date, required: true },
    status: {
      type: String,
      enum: ["not started", "todo", "in progress", "done"],
      default: "not started",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

// Réponses JSON proches de l'ancien format SQL : `id` + `user_id`.
todoSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    ret.user_id = ret.user;
    delete ret._id;
    delete ret.user;
  },
});

export const Todo = mongoose.model("Todo", todoSchema);

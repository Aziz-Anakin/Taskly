import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    firstname: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

// Expose `id` (string) et masque `_id`, `__v` et le mot de passe dans les réponses JSON.
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
  },
});

export const User = mongoose.model("User", userSchema);

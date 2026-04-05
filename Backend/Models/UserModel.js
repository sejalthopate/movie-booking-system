import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true   // 📱 number
    },

    role: {
      type: String,
      enum: ["admin", "theatreAdmin", "user"],  // 🎯 theatreAdmin added
      default: "user"
    },

    theatreId: {                                 // 🎯 theatreId added
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      default: null
    },

    isBlocked: {
      type: Boolean,
      default: false   // 🚫 admin block
    },

    isTempPassword: {                          // ⚡ temp password flag
      type: Boolean,
      default: false
    }

  },
  {
    timestamps: true  // 🕒 createdAt, updatedAt AUTO
  }
);

export const User = mongoose.model("User", userSchema);

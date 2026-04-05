import mongoose from "mongoose";

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Actor", "Producer", "Director"],
      required: true,
    },

    // Actor साठीच
    character: {
      type: String,
    },

    photo: {
      type: String, // poster / profile image URL
      required: true,
    },

    bio: {
      type: String,
    },

    dob: {
      type: Date,
    },

    // Optional fields
    aka: {
      type: String, // Also Known As
    },

    birthInfo: {
      type: String, // Example: "1898, Delhi, India"
    },

    // Friends / colleagues
    peers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person",
      },
    ],

    // Family members
    family: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
        },
        relation: String, // wife, son, brother
      },
    ],
  },
  { timestamps: true }
);

const Person = mongoose.model("Person", personSchema);

export default Person;

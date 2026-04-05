import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    poster: { type: String, required: true },

    trailers: [
      {
        language: { type: String, required: true },
        url: { type: String, required: true }
      }
    ],

    genre: { type: String },
    duration: { type: String },

    // ✅ ADD THIS LINE (ONLY CHANGE)
    language: { type: String },

    releaseDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    timeSlots: [{ type: String }],

    status: {
      type: String,
      enum: ["upcoming", "new", "running"],
      default: "upcoming",
    },

    cast: [
      {
        person: { type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true },
        character: { type: String, required: true },
      },
    ],
    crew: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
    peers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
    family: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
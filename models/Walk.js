import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["LineString"],
      default: "LineString",
    },
    coordinates: {
      type: [[Number]],
      default: [],
    },
  },
  { _id: false }
);

const walkSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["en_curso", "finalizada"],
      default: "en_curso",
    },
    distanceMeters: {
      type: Number,
      default: 0,
    },
    durationSeconds: {
      type: Number,
    },
    route: {
      type: pointSchema,
      default: () => ({ type: "LineString", coordinates: [] }),
    },
  },
  { timestamps: true }
);

const Walk = mongoose.model("Walk", walkSchema);

export default Walk;
import mongoose from "mongoose";
import { nanoid } from "nanoid";

const linkGroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    groupUrl: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(8),
    },
    links: [
      {
        title: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    theme: {
      backgroundColor: {
        type: String,
        default: "#ffffff",
      },
      textColor: {
        type: String,
        default: "#000000",
      },
      buttonColor: {
        type: String,
        default: "#3b82f6",
      },
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const linkGroupModel = mongoose.model("LinkGroup", linkGroupSchema);

import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const messageSchema = mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);

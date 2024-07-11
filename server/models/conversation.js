import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const conversationSchema = mongoose.Schema(
  {
    sender: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    messages: [{ type: ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

export default mongoose.model("Convarsation", conversationSchema);

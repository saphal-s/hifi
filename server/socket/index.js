import express from "express";
import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { getConversation } from "../helpers/getConversation.js";

const app = express();

// socket connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Allow credentials (cookies)
  },
});

// online user
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("connect user", socket.id);
  const token = socket.handshake.auth.token;

  // user details
  const decode = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decode.id);

  socket.join(user?._id.toString());
  onlineUser.add(user?._id?.toString());
  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    const userDtails = await User.findById(userId).select("-password");
    const payload = {
      _id: userDtails?._id,
      name: userDtails?.name,
      email: userDtails?.email,
      avatar: userDtails?.avatar,
      online: onlineUser.has(userId),
    };
    socket.emit("message-user", payload);
    // previous message
    const getConversationMessage = await Conversation.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });
    socket.emit("message", getConversationMessage?.messages);
  });

  // new message
  socket.on("new message", async (data) => {
    // check conversation is available on both user

    let conversation = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    console.log(conversation);

    if (!conversation) {
      const createConversation = await Conversation({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = await Message({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data.msgByUserId,
    });

    const saveMessage = await message.save();

    const updateConversation = await Conversation.updateOne(
      {
        _id: conversation?._id,
      },
      { $push: { messages: saveMessage?._id } }
    );

    const getConversationMessage = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });
    io.to(data?.sender).emit("message", getConversationMessage.messages || []);
    io.to(data?.receiver).emit(
      "message",
      getConversationMessage.messages || []
    );
    // send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReceiver);
  });

  // sidebar
  socket.on("sidebar", async (currentUserId) => {
    console.log("currentUserId", currentUserId);
    const conversation = await getConversation(currentUserId);
    socket.emit("conversation", conversation);
  });
  socket.on("seen", async (msgByUserId) => {
    const conversation = await Conversation.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });
    const conversationMessageId = conversation?.messages || [];
    const updateMessages = await Message.updateMany(
      {
        _id: { $in: conversationMessageId },
        msgByUserId: msgByUserId,
      },
      { $set: { seen: true } }
    );
    // send conversation
    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit("conversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReceiver);
  });

  // disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id.toString());
    console.log("disconnect user", socket.id);
  });
});

export { app, server };

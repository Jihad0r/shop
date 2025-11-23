import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    resiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
  },
  { timestamps: true }
);


const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;

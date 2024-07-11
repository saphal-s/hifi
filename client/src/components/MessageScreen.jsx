import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoChevronBackOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { FaRegImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from "../helpers/uploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import { MdSend } from "react-icons/md";
import moment from "moment";

const MessageScreen = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    avatar: "",
    online: false,
    _id: "",
  });

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage((prev) => {
      return { ...prev, imageUrl: uploadPhoto?.url };
    });
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => {
      return { ...prev, imageUrl: "" };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage((prev) => {
      return { ...prev, videoUrl: uploadPhoto?.url };
    });
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => {
      return { ...prev, videoUrl: "" };
    });
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params?.id);
      socketConnection.emit("seen", params?.id);
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });
      socketConnection.on("message", (data) => {
        // console.log(data);
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => {
      return { ...prev, text: value };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      socketConnection.emit("new message", {
        sender: user?._id,
        receiver: params.id,
        text: message.text,
        imageUrl: message.imageUrl,
        videoUrl: message.videoUrl,
        msgByUserId: user?._id,
      });
      setMessage({
        text: "",
        imageUrl: "",
        videoUrl: "",
      });
    }
  };
  console.log(allMessage);

  return (
    <div className="bg-slate-300 h-full">
      <header className="stickey top-0 h-16 bg-white flex justify-between items-center px-4">
        <Link to={"/chat"} className="lg:hidden">
          <IoChevronBackOutline size={25} />
        </Link>
        <div className="flex items-center gap-4 ">
          <div>
            <Avatar
              width={12}
              height={12}
              imageUrl={dataUser?.avatar}
              name={dataUser?.name}
              userId={dataUser._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 line-clamp-1 ">
              {dataUser?.name}
            </h3>
            <p className="-my-1 text-sm">
              {dataUser.online ? "online" : "offline"}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-sky-900">
            <HiOutlineDotsVertical size={20} />
          </button>
        </div>
      </header>
      {/* show all message */}
      <section className="h-[calc(100vh-130px)] overflow-x-hidden overflow-y-scroll scrollbar relative">
        {/* all messages */}
        <div className="flex flex-col gap-2 py-1" ref={currentMessage}>
          {allMessage &&
            allMessage.map((msg, index) => {
              return (
                <div
                  key={msg._id}
                  className={`bg-white p-1 max-w-[280px] md:max-w-sm lg:max-w-md mx-1 py-1 rounded w-fit ${
                    user?._id === msg.msgByUserId ? "ml-auto bg-teal-100" : ""
                  }`}
                >
                  <div className="w-full">
                    {msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        className="w-full h-full object-scale-down"
                      />
                    )}
                    {msg?.videoUrl && (
                      <video
                        src={msg.videoUrl}
                        className="w-full h-full object-scale-down"
                        controls
                      />
                    )}
                  </div>
                  <p className="px-2">{msg.text}</p>
                  <p className="text-xs ml-auto w-fit">
                    {moment(msg.createdAt).format("hh:mm")}
                  </p>
                </div>
              );
            })}
        </div>
        {/* upload image display */}
        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                width={300}
                height={300}
                alt="upload image"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {/* upload image display */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0  bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
            <Loading />
          </div>
        )}
      </section>
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative ">
          <button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-sky-800 hover:text-white"
          >
            <FaPlus size={20} />
          </button>
          {/* video and image */}
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3
                hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-sky-700">
                    <FaRegImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-700">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>
        {/* input box */}
        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            name="message"
            placeholder="Type here message..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleChange}
          />
          <button className="text-sky-800 hover:text-sky-900">
            <MdSend size={26} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessageScreen;

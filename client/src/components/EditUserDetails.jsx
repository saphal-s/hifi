import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import uploadFile from "../helpers/uploadFile";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const EditUserDetails = ({ onClose, user }) => {
  const [state, setState] = useState({
    name: user?.name,
    avatar: user?.avatar,
  });
  useEffect(() => {
    setState((prev) => {
      return { ...prev, ...user };
    });
  }, [user]);
  const [currentImage, setCurrentImage] = useState("Change Image");
  const [imagePreview, setImagePreview] = useState();
  const dispatch = useDispatch();

  const fileHandle = async (e) => {
    if (e.target.files.length !== 0) {
      setCurrentImage(e.target.files[0].name);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    const file = e.target.files[0];
    const uploadAvatar = await uploadFile(file);
    setState((prev) => {
      return { ...prev, avatar: uploadAvatar?.url };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${import.meta.env.VITE_APP_BACKEND_URL}update-user`;
    try {
      console.log(state);
      const response = await axios.post(url, state, {
        withCredentials: true, // Set this to send cookies with the request
      });
      toast.success(response.data.message);
      if (response.data.success) {
        dispatch(setUser(response.data.data));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center h-full items-center">
      <div className="bg-white p-4 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit user details</p>
        <form onSubmit={handleSubmit}>
          <div className="my-3">
            <input
              type="text"
              id="name"
              name="name"
              className="bg-slate-200 px-3 w-full py-3 focus:outline-primary text-black"
              placeholder="Enter your name"
              value={state.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="my-3">
            <label htmlFor="avatar">
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary">
                <p className="text-sm text-slate-400">
                  {currentImage ? currentImage : <>Upload profile picture</>}
                </p>
              </div>
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="bg-slate-200 px-3 w-full py-3 focus:outline-primary hidden"
              placeholder="Enter password"
              onChange={fileHandle}
              required
            />
          </div>

          {imagePreview ? (
            <img
              src={imagePreview}
              alt="_image"
              className="rounded-full m-auto h-[60px] w-[60px]"
            />
          ) : (
            <>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="_image"
                  className="rounded-full m-auto h-[60px] w-[60px]"
                />
              ) : (
                <></>
              )}
            </>
          )}

          <div className="p-[0.5px] bg-slate-200"></div>
          <div className="flex gap-2 mt-4 w-fit ml-auto">
            <button
              className="border border-sky-900 text-sky-900 px-4 py-1 rounded hover:bg-sky-900 hover:text-white"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="border-sky-900 bg-sky-800 px-4 text-white border py-1 rounded hover:bg-sky-900"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);

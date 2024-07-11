import { useState } from "react";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegUser } from "react-icons/fa";

const Register = ({ setActive }) => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  const [currentImage, setCurrentImage] = useState("Choose Image");
  const [imagePreview, setImagePreview] = useState();

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
    const url = `${import.meta.env.VITE_APP_BACKEND_URL}register`;
    try {
      const response = await axios.post(url, state);
      toast.success(response.data.message);
      if (response.data.success) {
        setState({
          name: "",
          email: "",
          password: "",
          avatar: "",
        });
        setCurrentImage("Choose Image");
        setImagePreview(null);
        setActive(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="bg-white px-12 py-10 rounded-md max-w-full w-[550px]">
      <h3 className="text-sky-900 py-3 text-2xl font-bold">Register Now :)</h3>
      <p className="pb-4 flex justify-center items-center">
        <FaRegUser className="text-sky-900" size={30} />
      </p>
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
          <input
            type="email"
            id="email"
            name="email"
            className="bg-slate-200 px-3 w-full py-3 focus:outline-primary text-black"
            placeholder="Enter your email"
            value={state.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="my-3">
          <input
            type="password"
            id="password"
            name="password"
            className="bg-slate-200 px-3 w-full py-3 focus:outline-primary text-black"
            placeholder="Enter password"
            value={state.password}
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
            className="rounded-full m-auto h-[100px] w-[100px]"
          />
        ) : (
          <></>
        )}
        <button className="bg-sky-900 w-full rounded-md px-2 py-3 my-3">
          Register
        </button>
      </form>
      <p className="text-sky-900 mt-3">
        Already have an account?
        <span
          className="text-bold cursor-pointer"
          onClick={() => setActive(true)}
        >
          &nbsp; Login.
        </span>
      </p>
    </div>
  );
};

export default Register;

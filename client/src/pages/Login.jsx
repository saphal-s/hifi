import axios from "axios";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setToken } from "../redux/userSlice";

const Login = ({ setActive }) => {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${import.meta.env.VITE_APP_BACKEND_URL}login`;
    try {
      const response = await axios.post(url, state, {
        withCredentials: true, // Set this to send cookies with the request
      });
      toast.success(response.data.message);
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setState({
          email: "",
          password: "",
        });
        navigate("/chat");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="bg-white px-12 py-10 rounded-md max-w-full w-[550px]">
      <h3 className="text-sky-900 py-3 text-2xl font-bold">Login :)</h3>
      <p className="pb-4 flex justify-center items-center">
        <FaRegUser className="text-sky-900" size={30} />
      </p>
      <form onSubmit={handleSubmit}>
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

        <button className="bg-sky-900 w-full rounded-md px-2 py-3 my-3">
          Login
        </button>
      </form>
      <p className="text-sky-900 mt-3">
        Don't have an account?
        <span
          className="text-bold cursor-pointer"
          onClick={() => setActive(false)}
        >
          &nbsp; Register.
        </span>
      </p>
    </div>
  );
};

export default Login;

import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import MessageScreen from "../components/MessageScreen";
import Sidebar from "../components/Sidebar";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../redux/userSlice";
import logo from "../assets/logo.png";
import { io } from "socket.io-client";

const ChatHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const fetchUserDetails = async () => {
    try {
      const url = `${import.meta.env.VITE_APP_BACKEND_URL}user-details`;
      const response = await axios({
        url: url,
        withCredentials: true,
      });
      dispatch(setUser(response.data.data));
      if (response.data.logout) {
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // socket io connection
  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_APP_BACKEND_SOCKET_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
    socketConnection.on("onlineUser", (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });
    dispatch(setSocketConnection(socketConnection));
    return () => {
      socketConnection.disconnect();
    };
  }, []);
  const basepath = location.pathname === "/chat";

  return (
    <div className="grid lg:grid-cols-[320px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basepath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basepath && "hidden"}`}>
        <MessageScreen />
      </section>
      <div
        className={`justify-center items-center bg-slate-300 flex-col gap-2 hidden ${
          !basepath ? "hidden" : "lg:flex"
        }`}
      >
        <div>
          <img src={logo} alt="logo" />
          <p className="mt-2 text-slate-500 text-lg">
            Select user to sent message.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHome;

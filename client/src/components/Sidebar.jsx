import { BsChatDotsFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import EditUserDetails from "./EditUserDetails";
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from "./SearchUser";
import { FaRegImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { logout } from "../redux/userSlice";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOption] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);
      socketConnection.on("conversation", (data) => {
        console.log("conversation", data);
        const conversationUserData = data.map((conversationUser, index) => {
          if (conversationUser.sender?._id === conversationUser.receiver?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          }
        });

        setAllUsers(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    localStorage.clear();
  };

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg text-slate-500 py-5 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `"w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200  rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="chat"
          >
            <BsChatDotsFill size={20} />
          </NavLink>
          <div
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200  rounded"
            title="Add Friend"
            onClick={() => setOpenSearchUser(true)}
          >
            <FaUserPlus size={20} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="mx-auto"
            title={user.name}
            onClick={() => setEditUserOption(true)}
          >
            <Avatar
              name={user?.name}
              userId={user?._id}
              imageUrl={user?.avatar}
              height={8}
              width={8}
            />
          </button>
          <button
            onClick={handleLogout}
            title="logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200  rounded"
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>
      <div className="w-full">
        <div className="flex h-16 items-center">
          <h2 className="text-xl font-bold text-slate-700 p-4">Message</h2>
        </div>
        <div className="p-[0.5px] bg-slate-200"></div>
        <div className="h-[calc(100vh-66px)] overflow-x-hidden overflow-y-scroll scrollbar">
          {allUsers.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <GoArrowUpLeft size={30} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start conversation with.
              </p>
            </div>
          )}
          {allUsers.map((conv, index) => {
            return (
              <NavLink
                to={"/chat/" + conv?.userDetails?._id}
                key={conv?._id}
                className="flex items-center gap-2 px-2 py-3 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"
              >
                <div>
                  <Avatar
                    name={conv?.userDetails?.name}
                    imageUrl={conv?.userDetails?.avatar}
                    userId={conv?.userDetails?._id}
                    height={12}
                    width={12}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaRegImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-sky-800 text-white font-semibold rounded-full ">
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
      {/* edit user details */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOption(false)} user={user} />
      )}
      {/* search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;

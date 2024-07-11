import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import { toast } from "react-toastify";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const url = `${import.meta.env.VITE_APP_BACKEND_URL}search-user`;
    try {
      setLoading(true);
      const response = await axios.post(
        url,
        { search: search },
        {
          withCredentials: true, // Set this to send cookies with the request
        }
      );
      setLoading(false);
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        <div className="bg-white rounded h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search user by name, email...."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoIosSearch size={25} />
          </div>
        </div>
        {/* display search user */}
        <div className="bg-white mt-2 w-full p-4 rounded">
          {searchUser.length === 0 && !loading && (
            <p
              className="text-center
        text-slate-500"
            >
              no user found
            </p>
          )}
          {loading && (
            <div>
              <Loading />
            </div>
          )}
          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user, index) => {
              return (
                <UserSearchCard key={user._id} user={user} onClose={onClose} />
              );
            })}
        </div>
      </div>
      <div className="absolute top-0 right-0 text-2xl lg:text-4xl hover:text-white">
        <button onClick={onClose}>
          <IoMdClose />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;

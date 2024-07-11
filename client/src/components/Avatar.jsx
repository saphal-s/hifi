import { RxAvatar } from "react-icons/rx";
import { useSelector } from "react-redux";

const Avatar = ({ userId, imageUrl, name, height, width }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  const getFirstLetters = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };
  const firstLetters = getFirstLetters(name);

  const isOnline = onlineUser.includes(userId);

  return (
    <div className={`text-slate-800  rounded-full font-bold relative`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="_image"
          className={`h-${height} w-${width} border border-slate-400 rounded-full flex justify-center items-center`}
        />
      ) : (
        <div
          className={`h-${height} w-${width} border border-slate-400 rounded-full flex justify-center items-center`}
        >
          {firstLetters}
        </div>
      )}
      {isOnline && (
        <div className="bg-green-600 p-1 absolute bottom-2 left-0 z-10 rounded-full"></div>
      )}
    </div>
  );
};

export default Avatar;

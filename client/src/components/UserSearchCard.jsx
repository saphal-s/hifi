import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserSearchCard = ({ user, onClose }) => {
  return (
    <Link
      to={`/chat/${user?._id}`}
      onClick={onClose}
      className="flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border-sky-900"
    >
      <div>
        <Avatar
          name={user?.name}
          imageUrl={user?.avatar}
          userId={user?._id}
          height={12}
          width={12}
        />
      </div>
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">
          {user?.name}
        </div>
        <p className="text-sm text-ellipsis line-clamp-1">{user?.email}</p>
      </div>
    </Link>
  );
};

export default UserSearchCard;

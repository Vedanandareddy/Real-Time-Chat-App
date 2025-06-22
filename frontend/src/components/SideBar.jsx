import { useEffect, useState } from 'react';
import { User } from "lucide-react";
import { useChatStore } from '../store/useChatStore';
import '../scrollbar.css'; // Import custom scrollbar styles
import { useAuthStore } from '../store/authStore';

const SideBar = () => {
  const {
    users,
    getUsers,
    isLoadingUsers,
    setSelectedUser,
    selectedUser,
  } = useChatStore();
  const { onlineUsers } = useAuthStore()
  const [isChecked, setisChecked] = useState(false)

  useEffect(() => {
    getUsers(); // Fetch users once on mount
  }, [getUsers]);

  const handleChange = (e) => {
    setisChecked(e.target.checked);
  };


  const currentOnlineUsers = users.filter((user) => onlineUsers.includes(user._id))
  const filteredUsers = isChecked ? currentOnlineUsers : users;


  return (
    <div className="w-[25%] h-full rounded-sm bg-base-200 border-2 border-base-100 flex flex-col">
      {/* Header */}
      <div className="flex flex-col px-4 py-3 border-b border-base-300 bg-base-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-primary">
            <User />
          </div>
          <div className="font-semibold text-primary text-lg">Contacts</div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="myCheckbox"
            checked={isChecked}
            onChange={handleChange}
            className="checkbox checkbox-sm"
          />
          <label htmlFor="myCheckbox" className="text-sm">
            Online Users Only
          </label>
        </div>
      </div>



      {/* Scrollable User List */}
      <div className="flex flex-col w-full flex-grow overflow-y-auto sidebar-scroll">
        {isLoadingUsers && (
          <div className="p-4 text-center text-sm opacity-60">Loading users...</div>
        )}

        {filteredUsers.map((user) => {
          const isOnline = onlineUsers?.includes(user._id);

          return (
            <button
              key={user._id}
              className={`w-full p-2 text-left transition-colors duration-200 ${selectedUser?._id === user._id
                ? "bg-primary text-primary-content"
                : "hover:bg-base-300"
                }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center w-full gap-3 ">
                <div className="w-16 h-16 relative">
                  <img
                    className="w-full h-full object-cover rounded-full border border-base-300 shadow-sm"
                    src={user.profilepic || "/avatar.png"}
                    alt="User Avatar"
                  />

                  {isOnline && (
                    <div className='bg-green-500 size-4 rounded-full absolute top-0 right-0'></div>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="font-medium">{user.fullname}</div>
                  <div className={`text-sm ${isOnline ? "text-green-500" : "opacity-60"}`}>
                    {isOnline ? "online" : "offline"}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;

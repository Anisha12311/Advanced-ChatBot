"use client";
import React, { useEffect } from "react";
import { MdAddCircle } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import Image from "next/image";
import { users } from "@/lib/constant/Chat";
import { useFetch } from "@/hooks/useFetch";
import { useUserList } from "@/hooks/useUserList";
import { useAuth } from "@/context/AuthContext";
import { IUserData } from "@/interface/dashboard";

const ChatList = ({
  setSelectedUser,
}: {
  setSelectedUser: React.Dispatch<React.SetStateAction<IUserData | undefined>>;
}) => {

  const { data } = useUserList();
  const { user } = useAuth();
  useEffect(() => {
    if (data && data.length > 0) {
      const firstUser = data.find((u) => u.email !== user?.email);
      if (firstUser) setSelectedUser(firstUser);
    }
  }, [data, user, setSelectedUser]);
  return (
    <section className="h-full flex flex-col bg-[#f2f5fa] dark:bg-gray-900">
      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h1 className="text-gray-800 dark:text-gray-100 text-lg font-medium">
          Chats
        </h1>
        <MdAddCircle className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-white transition-colors duration-200" />
      </div>

      <div className="p-4">
        <div className="relative rounded-2xl bg-white dark:bg-gray-700">
          <input
            className="w-full bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-300 text-gray-800 dark:text-gray-100 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl pl-3 pr-10 py-2 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 shadow-sm transition-colors duration-300"
            placeholder="Search"
          />
          <HiOutlineSearch className="absolute w-5 h-5 top-2.5 right-2.5 text-gray-500 dark:text-gray-300 cursor-pointer" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700 flex flex-col gap-2"
        >
          {data && data.length > 0 ? (
            <>
              {data
                .filter((u) => u.email !== user?.email)
                .map((user) => (
                  <li
                    onClick={() => setSelectedUser(user)}
                    key={user._id}
                    className="flex justify-between bg-white dark:bg-gray-800 p-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex min-w-0 gap-4">
                      <Image
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                        src="/images/a1.png"
                        alt={user.name}
                      />
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold text-[#475f7b] dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="mt-1 text-xs text-[#737373] dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        9:45
                      </p>
                    </div>
                  </li>
                ))}
            </>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </section>
  );
};

export default ChatList;

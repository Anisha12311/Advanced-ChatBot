"use client";

import { useState } from "react";
import ChatBox from "./ChatBox";
import ChatList from "./ChatList";
import { IUserData } from "@/interface/dashboard";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState<IUserData | undefined>();
  
  return (
    <section className="mt-12 h-[calc(100vh-3rem)] px-4 md:px-8 lg:px-8 xl:px-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
        {/* Chat List */}
        <div className="overflow-y-auto max-h-[calc(100vh-5rem)] rounded-lg bg-white dark:bg-gray-800 shadow-[0_3px_5px_1px_rgba(0,0,0,0.05)] dark:shadow-lg hover:shadow-md dark:hover:shadow-xl transition-shadow duration-300">
          <ChatList setSelectedUser={setSelectedUser} />
        </div>

        {/* Chat Box */}
        <div className="overflow-y-auto max-h-[calc(100vh-5rem)] md:col-span-2 bg-white dark:bg-gray-700 rounded-lg shadow-[0_3px_5px_1px_rgba(0,0,0,0.05)]  dark:shadow-inner-dark">
          <ChatBox selectedUser={selectedUser} />
        </div>

        {/* Right Panel */}
        <div className="hidden md:block overflow-y-auto max-h-[calc(100vh-5rem)] bg-gray-200 dark:bg-gray-800 rounded-lg shadow-inner dark:shadow-inner-dark p-4">
          {/* <ChatBox /> */}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

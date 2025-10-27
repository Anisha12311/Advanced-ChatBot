"use client";

import ChatBox from "./ChatBox";
import ChatList from "./ChatList";

const Dashboard = () => {
  return (
    <div className="bg-[#eef0f8] dark:bg-gray-900 h-full">
      <section className="pt-16 h-[98vh] overflow-auto px-4 md:px-8 lg:px-8 xl:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
          {/* Chat List */}
          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-[0_3px_5px_1px_rgba(0,0,0,0.05)] dark:shadow-lg hover:shadow-md dark:hover:shadow-xl transition-shadow duration-300">
            <ChatList />
          </div>

          {/* Middle Panel */}
          <div className="shadow-[0_3px_5px_1px_rgba(0, 0, 0, 0.05)] md:col-span-2 bg-[#ffffff] dark:bg-gray-700 rounded-lg shadow-inner dark:shadow-inner-dark p-4">
            <p className="text-gray-800 dark:text-gray-100">
              <ChatBox />
            </p>
          </div>

          {/* Right Panel */}
          <div className="md:col-start-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-inner dark:shadow-inner-dark p-4">
            <p className="text-gray-800 dark:text-gray-100">
              Right content goes here
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

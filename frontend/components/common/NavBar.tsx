"use client";

import { useEffect, useState } from "react";
import { Inconsolata } from "next/font/google";
import { BiFullscreen } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import { MdNotifications } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";

const inconsolata = Inconsolata({ subsets: ["latin"], weight: ["400", "700"] });

const NavRightIcons = [
  { name: "fullscreen", icon: BiFullscreen },
  { name: "notification", icon: MdNotifications },
  { name: "person", icon: BsFillPersonFill },
];

const NavBar = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between py-2 px-4 md:px-8 lg:px-8 xl:px-8 transition-all duration-500 z-50
        bg-white dark:bg-gray-900
        shadow-[0px_2px_5px_0px_rgba(19,23,38,0.3)] dark:shadow-lg
      `}
    >
      {/* Logo */}
      <div
        className={`${inconsolata.className} cursor-pointer text-xl font-bold
          text-gray-800 dark:text-gray-100
          hover:text-gray-700 dark:hover:text-gray-200
          transition-colors duration-300
        `}
      >
        Chat Bot
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        {NavRightIcons.map((icon) => (
          <div
            key={icon.name}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
          >
            <icon.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
        ))}

        {/* Dark Mode Toggle */}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
        >
          {darkMode ? (
            <MdOutlineLightMode className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <MdDarkMode className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;

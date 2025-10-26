"use client";

import { useState } from "react";
import { Inconsolata } from "next/font/google";
import { BiFullscreen } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import { MdNotifications } from "react-icons/md";

const inconsolata = Inconsolata({ subsets: ["latin"], weight: ["400", "700"] });

const NavRightIcons = [
  { name: "fullscreen", icon: BiFullscreen },
  { name: "notification", icon: MdNotifications },
  { name: "person", icon: BsFillPersonFill },
];

const NavBar = () => {
  return (
    <div>
      <nav
        className={`fixed py-2    shadow-[0px_2px_5px_0px_rgba(19,23,38,0.3)]  top-0 left-0 bg-white w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-16 transition-all duration-500 z-50`}
      >
        <div
          className={`${inconsolata.className} cursor-pointer text-xl text-[#475f7b] font-bold hover:text-[#556687] transition-colors duration-300`}
        >
          Chat Bot
        </div>

        {/* Desktop Right */}
        <div className="flex items-center gap-4">
          {NavRightIcons.map((icon) => (
            <div
              key={icon.name}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
            >
              <icon.icon className="w-5 h-5 text-[#7792b1]" />
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;

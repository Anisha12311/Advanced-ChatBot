import Image from "next/image";
import React from "react";
import { IoMdCall } from "react-icons/io";
import { IoVideocamSharp } from "react-icons/io5";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoSendSharp } from "react-icons/io5";

const ChatBox = () => {
  return (
    <section className="relative w-full h-full flex flex-col rounded-[10px] overflow-hidden transition-all duration-500">
      <div className="text-[#475f7b] block p-4 border-b border-[rgba(72,94,144,0.16)] bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 gap-4">
            <Image
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
              src="/images/a1.png"
              alt="User avatar"
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold text-[#475f7b] dark:text-white truncate">
                Marie
              </p>
              <p className="text-[10px] text-[#737373] dark:text-gray-400 truncate">
                Last Seen 10:30pm ago
              </p>
            </div>
          </div>
          <div className="flex gap-4 text-[#475f7b] dark:text-white cursor-pointer">
            <IoMdCall />
            <IoVideocamSharp />
            <FiMoreHorizontal />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-autobg-[#f9fafb] dark:bg-gray-700 mb-6  p-4">
        <div className="flex items-center mb-4 max-w-[80%]">
          <div className="flex-none flex flex-col items-center space-y-1 mr-4">
            <Image
              width={"24"}
              height={"24"}
              className="rounded-full w-10 h-10"
              alt=""
              src="/images/a1.png"
            />
            <a
              href="#"
              className="block text-xs hover:underline text-[#727070]"
            >
              Marie
            </a>
          </div>
          <div className="flex-1 bg-[#ececec] text-sm text-[#475f7b] p-2 rounded-lg mb-2 relative">
            <div>
              Tailwind chat boxes include a real-time chat with input, message
              cards with seen status, cards with status indicators, and group
              chats with images and audio.
            </div>

            <div className="absolute left-0 top-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-[#ececec]"></div>
          </div>
        </div>

        <div className="items-end justify-end flex">
          <div className="flex  items-center flex-row-reverse mb-4 max-w-[80%]">
            <div className="flex-none flex flex-col items-center space-y-1 ml-4">
              <Image
                width={"24"}
                height={"24"}
                className="rounded-full w-10 h-10"
                alt=""
                src="/images/a1.png"
              />
              <a
                href="#"
                className="block text-xs hover:underline text-[#727070]"
              >
                Marie
              </a>
            </div>
            <div className="flex-1 bg-[#6993ff] text-sm text-white p-2 rounded-lg mb-2 relative">
              <div>
                Tailwind chat boxes include a real-time chat with input, message
                cards with seen status, cards with status indicators, and group
                chats with images and audio.
              </div>

              <div className="absolute right-0 top-1/2 transform translate-x-1/2 rotate-45 w-2 h-2 bg-[#6993ff]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Say something..."
            className="flex-1 bg-[#ffffff] outline-0 text-[#475f7b] px-4 py-2 text-[12px] rounded-full "
          />
          <button className="bg-[#366eff] wave-circle hover:bg-[#3369f1] w-10 h-10 rounded-4xl items-center justify-center flex cursor-pointer ">
            <IoSendSharp className="text-[#ffffff] w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatBox;

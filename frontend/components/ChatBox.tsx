import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IoMdCall } from "react-icons/io";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoSendSharp } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import socket from "@/app/socket";
import { IMessages, IUserData } from "@/interface/dashboard";
import { axiosInstance } from "@/lib/axios";
import { Avatar, Badge } from "@mui/material";
import { useProfileById } from "@/hooks/useProfileById";
import { formatedDate } from "@/lib/utils";
import { useIsOnline } from "@/hooks/useIsOnline";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import Media from "./Media";

const ChatBox = ({ selectedUser }: { selectedUser: IUserData | undefined }) => {
  const [value, setValue] = useState("");
  const { user, profile, fetchUserProfile } = useAuth();

  const [messages, setMessages] = useState<IMessages[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevUserIdRef = useRef<string | null>(null);

  const { profileById } = useProfileById(selectedUser ? selectedUser._id : "");

  const { onlineStatus } = useIsOnline(user?.id);

  const status = onlineStatus[selectedUser?._id ?? ""]?.isOnline;
  console.log("anilog ~ status:", status);
  useEffect(() => {
    if (!user?.id) return;

    socket.emit("join", selectedUser?._id);

    return () => {
      socket.disconnect(); // 👈 ONLY HERE
    };
  }, [user?.id]);
  useEffect(() => {
    fetchUserProfile();
  }, [selectedUser?._id, user]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    if (prevUserIdRef.current === selectedUser._id) return;

    prevUserIdRef.current = selectedUser._id;

    const fetchMessages = async () => {
      const res = await axiosInstance.get(
        `/messages/${user.id}/${selectedUser._id}`
      );
      const formattedMessages = res.data.map((msg: IMessages) => ({
        ...msg,
        formattedDate: formatedDate(msg.createdAt),
      }));
      setMessages(formattedMessages);
    };

    fetchMessages();
  }, [user, selectedUser]);
  useEffect(() => {
    if (!user || !selectedUser) return;

    socket.emit("messageSeen", {
      from: selectedUser._id,
      to: user.id,
    });
  }, [selectedUser?._id]);

  useEffect(() => {
    if (!user) return;

    socket.emit("join", user.id);

    const handleMessage = (msg: IMessages) => {
      console.log("anilog ~ msg:", msg, selectedUser?._id);
      const formatedMsg = {
        ...msg,
        formatedDate: formatedDate(msg.createdAt),
      };

      setMessages((prev) => {
        if (prev.some((m) => m.messageId === formatedMsg.messageId))
          return prev;
        return [...prev, formatedMsg];
      });
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [user, selectedUser]);

  const handleSendMessage = () => {
    if (!value.trim() || !user || !selectedUser) return;

    socket.emit("sendingMessage", {
      messageFrom: user.id,
      messageTo: selectedUser._id,
      content: value,
    });

    setValue("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    socket.on("messageStatusUpdate", ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId ? { ...msg, status } : msg
        )
      );
    });

    return () => {
      socket.off("messageStatusUpdate");
    };
  }, []);
  useEffect(() => {
    if (!user || !selectedUser) return;

    socket.emit("chatSeen", {
      from: selectedUser._id, // sender
      to: user.id, // receiver
    });
  }, [selectedUser, selectedUser?._id, user]);
  useEffect(() => {
    console.log("anilog ~ messages:", messages);
  }, [messages]);
  const renderTicks = (msg: IMessages) => {
    if (msg.status === "SENT") return <CheckIcon sx={{ fontSize: 14 }} />;

    if (msg.status === "DELIVERED")
      return <DoneAllIcon sx={{ fontSize: 14 }} />;

    if (msg.status === "SEEN")
      return <DoneAllIcon sx={{ fontSize: 14, color: "#4fc3f7" }} />;

    return null;
  };

  useEffect(() => {
    console.log("First");
    if (selectedUser?._id) {
      socket.emit("chatOpen", {
        userId: user?.id,
        to: selectedUser?._id,
      });
    }

    return () => {
      socket.emit("chatClose", user?.id);
    };
  }, [selectedUser?._id, user?.id]);

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
                {selectedUser?.name}
              </p>
              <p className="text-[10px] text-[#737373] dark:text-gray-400 truncate">
                Last Seen 10:30pm ago
              </p>
            </div>
          </div>
          <Media selectedUser={selectedUser} />
        </div>
      </div>

      <div className="flex-1 bg-[#f9fafb] dark:bg-gray-700 p-4 h-[50%] overflow-y-auto flex flex-col">
        {messages
          .filter(
            (msg) =>
              (msg.messageFrom === user?.id &&
                msg.messageTo === selectedUser?._id) ||
              (msg.messageFrom === selectedUser?._id &&
                msg.messageTo === user?.id)
          )
          .map((msg) => {
            const isSent = msg.messageFrom === user?.id;

            return (
              <div
                key={msg.messageId}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "24px",
                }}
              >
                <div
                  className={`flex items-center  max-w-[80%] ${
                    isSent ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  <div
                    className={`flex flex-col items-center space-y-1 ${
                      isSent ? "ml-4" : "mr-4"
                    }`}
                  >
                    {isSent ? (
                      <Avatar
                        src={profile || undefined}
                        sx={{
                          width: "2.3rem",
                          height: "2.3rem",
                          fontSize: "0.893rem",
                          cursor: "pointer",
                          backgroundColor: "rgb(255, 204, 188)",
                          color: "rgb(191, 54, 12)",
                        }}
                      >
                        {!profile && user?.name.split("")[0].toUpperCase()}
                      </Avatar>
                    ) : (
                      <Badge
                        variant="dot"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        sx={{
                          "& .MuiBadge-badge": {
                            bottom: "5px",
                            right: "5px",
                            width: "10px",
                            height: "10px",
                            backgroundColor: `${
                              status ? "rgb(104, 218, 106)" : "#ffb224"
                            }`,
                          },
                        }}
                      >
                        <Avatar src={profileById || undefined}>
                          {!profileById &&
                            selectedUser?.name.split("")[0].toUpperCase()}
                        </Avatar>
                      </Badge>
                    )}
                  </div>

                  {/* Bubble */}
                  <div>
                    <div
                      className={`flex-1 text-sm p-2 rounded-lg  relative ${
                        isSent
                          ? "bg-[#6993ff] text-white"
                          : "bg-[#ececec] text-[#475f7b]"
                      }`}
                    >
                      <div>{msg.content}</div>

                      <div
                        className={`absolute top-1/2 w-2 h-2 rotate-45 ${
                          isSent
                            ? "right-0 translate-x-1/2 bg-[#6993ff]"
                            : "left-0 -translate-x-1/2 bg-[#ececec]"
                        }`}
                      />
                    </div>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {" "}
                      {renderTicks(msg)}
                    </div>
                  </div>
                </div>
                <div
                  className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                  style={{
                    color: "rgb(69, 83, 87)",
                    fontSize: "12px",
                    marginTop: "5px",
                    marginRight: "58px",
                    marginLeft: isSent ? "" : "58px",
                  }}
                >
                  {msg.formattedDate}
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Say something..."
            className="flex-1 bg-[#ffffff] outline-0 text-[#475f7b] px-4 py-2 text-[12px] rounded-full "
          />
          <button
            className="bg-[#366eff] hover:bg-[#3369f1] w-10 h-10 rounded-4xl items-center justify-center flex cursor-pointer "
            onClick={handleSendMessage}
          >
            <IoSendSharp className="text-[#ffffff] w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatBox;

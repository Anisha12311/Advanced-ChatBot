import socket from "@/app/socket";
import React, { useEffect, useState } from "react";

export const useNotification = () => {
  const [userNotification, setUserNotification] = useState([]);
  useEffect(() => {
    socket.on("notification", (data) => {
      console.log("data", data);
      setUserNotification((prev) => );
    });
    return () => {
      socket.off("notification");
    };
  }, []);

  return { userNotification };
};

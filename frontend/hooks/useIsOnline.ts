import socket from "@/app/socket";
import { useEffect, useState } from "react";

export const useIsOnline = (currentUserId?: string) => {
  const [onlineStatus, setOnlineStatus] = useState<
    Record<string, { isOnline: boolean; lastActive: string }>
  >({});

  useEffect(() => {
    if (!currentUserId) return;

    socket.emit("join", currentUserId);

    const handler = (data: {
      userId: string;
      isOnline: boolean;
      lastActive: string;
    }) => {
      setOnlineStatus((prev) => ({
        ...prev,
        [data.userId]: {
          isOnline: data.isOnline,
          lastActive: data.lastActive,
        },
      }));
    };

    socket.on("updateUserStatus", handler);

    return () => {
      socket.off("updateUserStatus", handler);
    };
  }, [currentUserId]);

  return { onlineStatus };
};

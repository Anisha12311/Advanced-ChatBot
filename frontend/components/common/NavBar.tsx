"use client";

import React, { useEffect, useRef, useState } from "react";
import { Inconsolata } from "next/font/google";
import { BiFullscreen } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import { MdNotifications } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import {
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import ProfileDialog from "./ProfileDialog";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import { useIsOnline } from "@/hooks/useIsOnline";
import socket from "@/app/socket";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Notification from "../Notification";
import { IAllNotify } from "@/interface/dashboard";
import { axiosInstance } from "@/lib/axios";
const inconsolata = Inconsolata({ subsets: ["latin"], weight: ["400", "700"] });

const NavBar = () => {
  const { user, logout, profile, setProfile, fetchUserProfile } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [anchorElNotify, setAnchorElNotify] =
    React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { onlineStatus } = useIsOnline(user?.id);
  const currentUserStatus = onlineStatus[user?.id ?? ""]?.isOnline;
  const [allNotification, setNotification] = useState<IAllNotify[]>([]);
  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("notification", (data) => {
      setNotification([data, ...allNotification]);
    });
  }, [allNotification]);

  useEffect(() => {
    console.log("anilog ~ allNotification:", allNotification);
  }, [allNotification]);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleProfile = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccount = () => {
    setOpenDialog(true);
  };

  const handleLogout = () => {
    logout();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotify(event.currentTarget);
    setNotifyOpen((previousOpen) => !previousOpen);
  };
  const fetchNotificaiton = async () => {
    const response = await axiosInstance.get(
      `/message/notification/${user?.id}`
    );
    console.log(response);
    if (response && response.data) {
      setNotification(response.data);
    }
  };
  useEffect(() => {
    fetchNotificaiton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleClearNotification = async (_id: string) => {
    const response = await axiosInstance.delete(`/message/notification/${_id}`);
    console.log("response", response);
    fetchNotificaiton();
  };

  const handleReadNotification = async (_id: string) => {
    const response = await axiosInstance.patch(
      `/message/notification/read/${_id}`
    );
    console.log("response", response);
    fetchNotificaiton();
  };

  const handleReadRedirect = (id: string) => {};

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between py-2 px-4 md:px-8 lg:px-8 xl:px-8 transition-all duration-500 z-50
        bg-white dark:bg-gray-900
        shadow-[0px_2px_5px_0px_rgba(19,23,38,0.3)] dark:shadow-lg
      `}
    >
      <div
        className={`${inconsolata.className} cursor-pointer text-xl font-bold
          text-gray-800 dark:text-gray-100
          hover:text-gray-700 dark:hover:text-gray-200
          transition-colors duration-300
        `}
      >
        Chat Bot
      </div>

      <div className="flex items-center gap-4">
        <IconButton onClick={handleClick}>
          <Badge
            badgeContent={allNotification.length}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "red",
                color: "white",
              },
            }}
          >
            <NotificationsIcon
              sx={{
                width: "24px",
                height: "24px",
                cursor: "pointer",
                color: "#272626",
              }}
            />
          </Badge>
        </IconButton>

        <Notification
          open={notifyOpen}
          anchorEl={anchorElNotify}
          allNotification={allNotification}
          handleClearNotification={handleClearNotification}
          handleReadNotification={handleReadNotification}
          handleReadRedirect={handleReadRedirect}
        />
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
                currentUserStatus ? "rgb(104, 218, 106)" : "#ffb224"
              }`,
            },
          }}
        >
          <Avatar
            src={profile || undefined} // only use real image URL
            sx={{
              width: "1.8rem",
              height: "1.8rem",
              fontSize: "0.893rem",
              cursor: "pointer",
              backgroundColor: "rgb(255, 204, 188)",
              color: "rgb(191, 54, 12)",
            }}
            onClick={handleProfile}
          >
            {!profile && user?.name[0].toUpperCase()}
          </Avatar>
        </Badge>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ marginTop: "10px" }}
          disableAutoFocusItem
        >
          <MenuItem sx={{ gap: "5px" }}>
            <ManageAccountsIcon
              sx={{ width: "36px", color: "rgba(0, 0, 0, 0.54)" }}
            />
            <Typography onClick={handleAccount}> Manage Account</Typography>
          </MenuItem>
          <MenuItem sx={{ gap: "5px" }}>
            <LogoutIcon sx={{ width: "36px", color: "rgba(0, 0, 0, 0.54)" }} />{" "}
            <Typography onClick={handleLogout}> Logout </Typography>
          </MenuItem>
        </Menu>
        <ProfileDialog
          open={openDialog}
          setOpen={setOpenDialog}
          setProfile={setProfile}
        />
      </div>
    </nav>
  );
};

export default NavBar;

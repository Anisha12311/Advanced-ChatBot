"use client";
import { useAuth } from "@/context/AuthContext";
import {
  Avatar,
  Box,
  Dialog,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TabPanel } from "./TabPanel";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import ResizeImage from "./ResizeImage";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { axiosInstance } from "@/lib/axios";

const ProfileDialog = ({
  open,
  setOpen,
  setProfile,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProfile: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { user, logout, profile, fetchUserProfile, clearProfile } = useAuth();
  const [openResize, setOpenResize] = useState(false);

  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [value, setValue] = React.useState(0);
  const handleFileInput = useRef<HTMLInputElement>(null);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [image, setImage] = useState<unknown>();

  const handleClose = () => {
    setOpen(false);
  };

  function a11yProps(index: number) {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  }

  const userDetails = [
    { type: "Name", content: user?.name },
    { type: "Username", content: user?.email },
    { type: "Login Email Id", content: user?.email },
  ];

  console.log(navigator.userAgent);

  const handleClick = () => {
    if (handleFileInput.current) handleFileInput.current.click();
  };

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files?.[0];
    if (fileUploaded) {
      setImage(fileUploaded);
      setOpenResize(true);
    }
  };

  useEffect(() => {
    setProfile(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);


  const handleDelete = async () => {
    await axiosInstance.delete("/api/deleteProfile");
    setAvatarSrc(null);
    setImage(null);
    setOpenResize(false);
    console.log("Delete");

    clearProfile();
    if (handleFileInput.current) {
      handleFileInput.current.value = "";
    }
  };

  const avatar = useMemo(() => {
    return avatarSrc ?? profile ?? undefined;
  }, [avatarSrc, profile]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            height: "60vh",
            maxHeight: "60vh",
          },
        },
      }}
    >
      <Box
        sx={{
          height: "58px",
          padding: "16px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          width: "100%",
        }}
      >
        <Box sx={{ fontSize: "20px", fontWeight: "600" }}>User Profile</Box>
      </Box>
      <Grid container spacing={2} height={"100%"}>
        <Grid
          size={4}
          sx={{
            boxShadow:
              "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px",
            background: "rgb(255, 255, 255)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              padding: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                background: "#e7e7e7",
                alignItems: "center",

                borderRadius: "4px",
                padding: "16px",
              }}
            >
              <Box
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    borderRadius: "50%",
                    padding: "4px",
                    boxShadow: "0 0 0 2px rgb(104, 218, 106)",
                  }}
                >
                  <Avatar
                    src={avatar}
                    sx={{
                      width: "48px",
                      height: "48px",
                      background: "white",
                      color: "green",
                    }}
                  ></Avatar>
                </Box>
                <Typography sx={{ marginTop: "10px" }}>
                  {" "}
                  {user?.name}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Tabs
                orientation="vertical"
                value={value}
                onChange={handleChange}
                sx={{
                  borderRight: "none",
                  "& .MuiTabs-indicator": {
                    display: "none",
                  },
                  "& .MuiTabs-list": {
                    alignItems: "flex-start",
                    width: "100%",
                  },
                  "& .MuiTab-root": {
                    alignItems: "flex-start",
                    width: "100%",
                  },
                  width: "100%",
                  "& .MuiTab-root.Mui-focusVisible": {
                    backgroundColor: "rgba(5, 46, 43, 0.08)",
                    color: "#4b4d4b",
                  },
                  "& .MuiTab-root.Mui-selected": {
                    color: "#4b4d4b",
                    backgroundColor: "rgba(5, 46, 43, 0.08)",
                  },
                }}
              >
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <PersonOutlineIcon sx={{ color: "black" }} />{" "}
                      <Typography>User Details</Typography>
                    </Box>
                  }
                  sx={{ textTransform: "none" }}
                  {...a11yProps(0)}
                />
                <Tab
                  onClick={() => logout()}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <LogoutIcon sx={{ color: "black" }} />{" "}
                      <Typography sx={{ marginLeft: "5px" }}>
                        Sign out
                      </Typography>
                    </Box>
                  }
                  sx={{ textTransform: "none" }}
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
          </Box>
        </Grid>
        <Grid size={8}>
          <TabPanel value={value} index={0}>
            <Box sx={{ gap: "8px", display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
                User details
              </Typography>
              <Box
                sx={{
                  border: "1px solid rgba(2, 10, 8, 0.12)",
                  borderRadius: "8px",
                  gap: "16px",
                  display: "flex",
                  flexDirection: "column",
                  padding: "16px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  <Typography>Profile Image</Typography>

                  <Box
                    sx={{
                      display: "inline-flex",
                      borderRadius: "50%",
                      padding: "4px",
                      boxShadow: "0 0 0 2px rgb(104, 218, 106)",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: "50%",
                        justifyContent: "center",
                        display: "flex",
                        alignItems: "center",
                        border: "1px dashed rgba(2, 10, 8, 0.12)",
                      }}
                    >
                      <Avatar
                        src={avatar}
                        sx={{
                          width: "108px",
                          height: "108px",
                          background: "white",
                          color: "green",
                          fontSize: "1.5rem",
                        }}
                      ></Avatar>
                    </Box>
                  </Box>

                  {(avatarSrc || profile) && (
                    <Box
                      sx={{
                        background: "white",
                        borderRadius: "50%",
                        padding: "8px",
                        zIndex: 3,
                        position: "absolute",
                        boxShadow:
                          "rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 5px 8px 0px, rgba(0, 0, 0, 0.12) 0px 1px 14px 0px",
                        right: "-5px",
                        top: "68px",
                        cursor: "pointer",
                      }}
                      onClick={handleDelete}
                    >
                      <DeleteIcon sx={{ color: "red" }} />
                    </Box>
                  )}

                  {avatarSrc && (
                    <Box
                      sx={{
                        background: "white",
                        borderRadius: "50%",
                        padding: "8px",
                        zIndex: 3,
                        position: "absolute",
                        boxShadow:
                          "rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 5px 8px 0px, rgba(0, 0, 0, 0.12) 0px 1px 14px 0px",
                        right: "87px",
                        top: "68px",
                        cursor: "pointer",
                      }}
                      onClick={() => setOpenResize(true)}
                    >
                      <EditIcon sx={{ color: "gray" }} />
                    </Box>
                  )}

                  {!avatarSrc && !profile && (
                    <Box
                      sx={{
                        background: "rgb(230, 234, 235)",
                        borderRadius: "50%",
                        padding: "8px",
                        zIndex: 3,
                        position: "absolute",
                        boxShadow:
                          "rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 5px 8px 0px, rgba(0, 0, 0, 0.12) 0px 1px 14px 0px",
                        right: "2px",
                        top: "68px",
                        cursor: "pointer",
                      }}
                      onClick={handleClick}
                    >
                      <UploadFileIcon sx={{ color: "rgba(0, 0, 0, 0.56)" }} />
                    </Box>
                  )}

                  <input
                    ref={handleFileInput}
                    type="file"
                    onChange={handleChangeFile}
                    style={{ display: "none" }}
                    accept="image/jpeg,image/png,image/gif,image/bmp,image/svg+xml"
                  />
                  {openResize && openResize && (
                    <ResizeImage
                      handleFileInput={
                        handleFileInput as React.RefObject<HTMLInputElement>
                      }
                      image={image as File}
                      setAvatarSrc={setAvatarSrc}
                      setOpenResize={setOpenResize}
                      openResize={openResize}
                      setProfile={setProfile}
                    />
                  )}
                </Box>
                {userDetails.map((users) => (
                  <Box
                    key={users.type}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      position: "relative",
                    }}
                  >
                    <Box>{users?.type}</Box>
                    <Typography>{users?.content}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </TabPanel>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ProfileDialog;

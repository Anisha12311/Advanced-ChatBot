import {
  Popper,
  Fade,
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";
import socket from "@/app/socket";
import { useEffect } from "react";
import { IAllNotify } from "@/interface/dashboard";
import { timeAgo } from "@/lib/utils";

interface INotification {
  open: boolean;
  anchorEl: HTMLElement | null;
  allNotification: IAllNotify[];
  handleClearNotification: (_id: string) => void;
  handleReadNotification: (_id: string) => void;
  handleReadRedirect: (id: string) => void;
}

const Notification = ({
  open,
  anchorEl,
  allNotification,
  handleClearNotification,
  handleReadNotification,
  handleReadRedirect,
}: INotification) => {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      transition
      sx={{ zIndex: 1500 }}
      placement="bottom-start"
      modifiers={[
        {
          name: "offset",
          options: { offset: [70, 0] },
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Box
            sx={{
              position: "relative",
              bgcolor: "background.paper",
              boxShadow: 3,
              borderRadius: "4px",
              width: "392px",
            }}
          >
            <Box
              sx={{
                padding: "12px 16px",
                borderBottom: "1px solid rgba(2, 10, 8, 0.12)",
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-start",
                gap: "14px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "rgb(2, 10, 8)",
                }}
              >
                {" "}
                Notification
              </Typography>
              <Avatar
                sx={{
                  background: "#494949",
                  width: "24px",
                  height: "24px",
                  fontSize: "14px",
                }}
              >
                {allNotification.length ?? 0}
              </Avatar>
            </Box>
            <Box
              sx={{
                background: "rgb(246, 248, 252)",
                padding: "8px 8px 0px",
                overflowY: "auto",
                maxHeight: "600px",
              }}
            >
              {allNotification.length > 0 ? (
                allNotification.map((data) => (
                  <Box
                    key={data.messageId}
                    sx={{
                      boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                      background: "white",
                      borderRadius: "4px",
                      marginBottom: "10px",
                    }}
                    onClick={() => handleReadRedirect(data.messageTo)}
                  >
                    <Box sx={{ padding: "8px 8px 8px 16px" }}>
                      <Box
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Box
                          sx={{
                            gap: "16px",
                            alignItems: "center",
                            display: "flex",
                            width: "217px",
                          }}
                        >
                          <Avatar
                            src={data.avatar || undefined}
                            sx={{
                              width: "1.8rem",
                              height: "1.8rem",
                              fontSize: "0.893rem",
                              cursor: "pointer",
                              backgroundColor: "rgb(255, 204, 188)",
                              color: "rgb(191, 54, 12)",
                            }}
                          >
                            {!data.avatar &&
                              data.senderName?.split("")[0].toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "15px",
                                fontWeight: 600,
                                color: "rgb(42 42 42)",
                              }}
                            >
                              {data.senderName}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                fontWeight: 400,
                                color: "rgba(2, 10, 8, 0.6)",
                              }}
                            >
                              {timeAgo(data.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: "12px" }}>
                          <IconButton
                            onClick={() => handleReadNotification(data._id)}
                          >
                            <DoneAllIcon
                              sx={{
                                color: "rgba(0, 0, 0, 0.54)",
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                              }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={() => handleClearNotification(data._id)}
                          >
                            <CancelIcon
                              sx={{
                                color: "rgba(0, 0, 0, 0.54)",
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                              }}
                            />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ marginTop: "10px", marginLeft: "10px" }}>
                        <Typography
                          sx={{
                            color: "rgba(2, 10, 8, 0.87)",
                            fontSize: "0.813rem",
                            fontWeight: 400,
                          }}
                        >
                          {data.content}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    justifyContent: "center",
                    display: "flex",
                    padding: "10px",
                  }}
                >
                  <Typography>No notifications found.</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Fade>
      )}
    </Popper>
  );
};
export default Notification;

import {
  Avatar,
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import socket from "@/app/socket";
import { IUserData } from "@/interface/dashboard";
import { useAuth } from "@/context/AuthContext";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

interface IIcommingCall {
  from: string;
  to: string;
  type: string;
}

const peerConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const Media = ({ selectedUser }: { selectedUser: IUserData | undefined }) => {
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [incomingCall, setIncomingCall] = useState<IIcommingCall | null>(null);
  const { user } = useAuth();

  const [incomingOpen, setIncomingOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createPeer = async (targetUserId?: string) => {
    peerRef.current = new RTCPeerConnection(peerConfig);
    let mediaStream: MediaStream;

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (!localVideo.current) return;
      localVideo.current.srcObject = mediaStream;
      mediaStream
        .getTracks()
        .forEach((track) => peerRef.current?.addTrack(track, mediaStream));

      peerRef.current.ontrack = (e) => {
        if (!remoteVideo.current) return;
        remoteVideo.current.srcObject = e.streams[0];
      };

      peerRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("webrtcIceCandidate", {
            to: targetUserId,
            candidate: e.candidate,
          });
        }
      };
    } catch (err) {
      console.error("Failed to get user media:", err);
    }
  };

  const callEnd = () => {
    peerRef.current?.close();
    peerRef.current = null;
  };

  const callUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("incomingCall", (data) => {
      callUserRef.current = data.from;

      setIncomingCall(data);
    });

    socket.on("callAccepted", async () => {
      setOpen(true);

      const offer = await peerRef.current?.createOffer();
      await peerRef.current?.setLocalDescription(offer);
      socket.emit("webrtcOffer", {
        to: callUserRef.current,
        offer,
      });
    });
    socket.on("webrtcOffer", async (offer) => {
      await createPeer(callUserRef.current!);
      peerRef.current?.setRemoteDescription(offer);

      const answer = await peerRef.current?.createAnswer();
      peerRef.current?.setLocalDescription(answer);

      socket.emit("webrtcAnswer", {
        to: callUserRef.current,
        answer,
      });
    });

    socket.on("webrtcAnswer", async (answer) => {
      await peerRef.current?.setRemoteDescription(answer);
    });
    socket.on("webrtcIceCandidate", (candidate) => {
      peerRef.current?.addIceCandidate(candidate);
    });
    socket.on("callRejected", ({ from }) => {
      console.log("Call rejected by:", from);
      setIncomingOpen(false);
      callEnd();
    });
    socket.on("callEnded", callEnd);

    return () => {
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("webrtcOffer");
      socket.off("webrtcAnswer");
      socket.off("webrtcIceCandidate");
      socket.off("callRejected");
      socket.off("callEnded");
    };
  }, [incomingCall]);

  useEffect(() => {
    console.log("anilog ~ incomingCall:", incomingCall);
  }, [incomingCall]);

  const handleStartCall = async () => {
    handleClickOpen();
    if (!selectedUser) return;
    await createPeer(selectedUser?._id);

    callUserRef.current = selectedUser._id;

    socket.emit("callUser", {
      from: user?.id,
      to: selectedUser?._id,
      callType: "video",
    });
  };

  const handleAccept = async () => {
    setIncomingCall(null);
    setOpen(true);

    await createPeer(callUserRef.current!);
    socket.emit("acceptCall", {
      from: user?.id,
      to: callUserRef.current,
    });
  };

  const handleReject = async () => {
    socket.emit("rejectCall", {
      from: user?.id,
      to: callUserRef.current,
    });
    setIncomingCall(null);
  };
  return (
    <>
      <div className="flex gap-4 text-[#475f7b] dark:text-white cursor-pointer">
        <IconButton>
          <PhoneIcon />
        </IconButton>
        <IconButton onClick={handleStartCall}>
          <VideocamIcon sx={{ width: "24px", height: "24px" }} />
        </IconButton>
      </div>
      <Dialog
        open={Boolean(incomingCall)}
        onClose={() => setIncomingCall(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        slotProps={{
          paper: {
            sx: {
              height: "50vh",
              maxHeight: "60vh",
              background: "black",
              color: "white",
              width: "40vh",
            },
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              gap: "60px",
            }}
          >
            <Typography sx={{ fontSize: "30px", marginTop: "50px" }}>
              Incoming call
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Avatar
                src={""}
                sx={{
                  width: "98px",
                  height: "98px",
                  background: "white",
                  color: "green",
                }}
              >
                A
              </Avatar>
              <Typography
                sx={{
                  marginTop: "10px",
                }}
              >
                {incomingCall?.from}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "70px" }}>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    width: "60px",
                    height: "60px",
                    background: "red",
                    borderRadius: "50%",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <IconButton onClick={handleReject}>
                    <CallEndIcon sx={{ color: "white" }} />
                  </IconButton>
                </Box>
                <Typography sx={{ marginTop: "10px" }}>Decline</Typography>
              </Box>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    width: "60px",
                    height: "60px",
                    background: "green",
                    borderRadius: "50%",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <IconButton onClick={handleAccept}>
                    <CallIcon sx={{ color: "white" }} />
                  </IconButton>
                </Box>
                <Typography sx={{ marginTop: "10px" }}>Accept</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>

      <Dialog
        onClose={handleClose}
        open={open}
        slotProps={{
          paper: {
            sx: {
              width: "60vw",
              maxWidth: "60vw",
              background: "black",
              color: "white",
              height: "72vh",
              maxHeight: "72vh",
            },
          },
        }}
      >
        <Box sx={{ width: "100%" }}>
          <DialogTitle>Video call</DialogTitle>

          <Box sx={{ display: "flex" }}>
            <Box sx={{ width: "600px", height: "500px" }}>
              <video
                ref={localVideo}
                autoPlay
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box sx={{ width: "600px", height: "500px" }}>
              <video
                ref={remoteVideo}
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              color: "white",
              padding: "15px 10px 10px 10px",
            }}
          >
            <Box
              sx={{
                width: "50px",
                height: "50px",
                background: "white",
                borderRadius: "50%",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <IconButton>
                <VideocamIcon sx={{ color: "black" }} />
              </IconButton>
            </Box>
            <Box
              sx={{
                width: "50px",
                height: "50px",
                background: "white",
                borderRadius: "50%",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <IconButton>
                <MicIcon sx={{ color: "black" }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Media;

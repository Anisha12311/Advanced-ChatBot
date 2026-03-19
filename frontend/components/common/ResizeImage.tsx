import React, { useRef, useState } from "react";
import { Box, Dialog, Slider, Button, Typography } from "@mui/material";
import AvatarEditor from "react-avatar-editor";
import CloseIcon from "@mui/icons-material/Close";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

interface IResizeImage {
  handleFileInput: React.RefObject<HTMLInputElement>;
  image: File;
  setAvatarSrc: (src: string) => void;
  setOpenResize: (value: boolean) => void;
  openResize: boolean;
  setProfile: (value: string) => void;
}

const ResizeImage = ({
  handleFileInput,
  image,
  setAvatarSrc,
  openResize,
  setOpenResize,
  setProfile,
}: IResizeImage) => {
  const editorRef = useRef<AvatarEditor | null>(null);
  const { fetchUserProfile } = useAuth();
  const [scale, setScale] = useState(1);

  const handleClose = () => {
    setOpenResize(false);
  };

  const handleScaleChange = (_: Event, value: number | number[]) => {
    setScale(value as number);
  };

  const handleSave = async () => {
    if (!editorRef.current) return;

    const canvas = editorRef.current.getImageScaledToCanvas();
    const imageUrl = canvas.toDataURL("image/png");
    await axiosInstance.put("/api/userProfile", {
      avatar: imageUrl,
    });
    setAvatarSrc(imageUrl);
    const data = await fetchUserProfile();
   if (data) setProfile(data);
    handleClose();
  };

  const handleFileClick = () => {
    handleFileInput.current?.click();
  };
  const isMobile = window.innerWidth < 600;

  return (
    <Dialog
      open={openResize}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            height: "87vh",
            maxHeight: "87vh",
            width: "79vh",
          },
        },
      }}
      fullScreen={isMobile}
    >
      <Box
        sx={{
          height: "58px",
          padding: "16px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ fontSize: "20px", fontWeight: "600" }}>Profile Image</Box>
        <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
      </Box>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{}}>
          <AvatarEditor
            ref={editorRef}
            image={image}
            width={790}
            height={760}
            border={50}
            borderRadius={500}
            scale={scale}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        sx={{ justifyContent: "space-between", padding: "16px" }}
      >
        <Box width={250} sx={{ marginLeft: "10px" }}>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={scale}
            onChange={handleScaleChange}
            sx={{ color: "black" }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={handleFileClick}
            variant="outlined"
            sx={{ borderColor: "black", color: "black", gap: "8px" }}
          >
            <CompareArrowsIcon /> <Typography> Replace Image</Typography>
          </Button>
          <Button
            sx={{ background: "#191919" }}
            onClick={handleSave}
            variant="contained"
          >
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ResizeImage;

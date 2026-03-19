import { Badge, styled, TextField } from "@mui/material";

export const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    color: "#000",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1e2939",
    },
    "&.Mui-focused": {
      borderColor: "#1e2939",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1e2939",
      },
    },
    "& .MuiInputLabel-outlined": {
      color: "#1e2939",
      "&.Mui-focused": {
        color: "#1e2939",
      },
    },
  },
  "& .MuiInputLabel-root": {
    color: "#1e2939",
    "&.Mui-focused": {
      color: "#1e2939",
    },
  },
}));

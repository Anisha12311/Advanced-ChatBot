import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const [profile, setProfile] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const user = await axiosInstance.get("/api/profile");

      setProfile(user.data.avatar);
      return user?.data?.avatar;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearProfile = () => {
    setProfile(null);
  };

  return {
    profile,
    loading,
    error,
    fetchUserProfile,
    setProfile,
    clearProfile,
  };
};

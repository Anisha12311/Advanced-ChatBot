import { axiosInstance } from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";

export const useProfileById = (id: string) => {
  console.log("anilog ~ id:", id);
  const [profileById, setProfileById] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserProfile = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/profile/${id}`);
      setProfileById(res.data?.avatar || "");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return { profileById, loading, error, fetchUserProfile };
};

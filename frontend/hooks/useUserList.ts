import { IUserData } from "@/interface/dashboard";
import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";

export const useUserList = () => {
  const [data, setData] = useState<IUserData[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserList = async () => {
    try {
      setLoading(true);
      const user = await axiosInstance.get("/api/allUsers");

      setData(user.data);
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

  useEffect(() => {
    fetchUserList();
  }, []);
  return { data, loading, error };
};

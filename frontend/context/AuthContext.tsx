"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { COOKIES } from "@/lib/constant/Storage";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import socket from "@/app/socket";
import { IMessages } from "@/interface/dashboard";

interface IUser {
  name: string;
  email: string;
  id: string;
}

interface IAuthContext {
  user: IUser | null;
  logout: () => void;
  login: (token: string) => void;
  profile: string | null;
  fetchUserProfile: () => Promise<string | undefined>;
  setProfile: React.Dispatch<React.SetStateAction<string | null>>;
  clearProfile: () => void;
  notification: IMessages[];
  setNotification: (value: IMessages[]) => void;
}

interface TokenPayload {
  id: string;
  name: string;
  email: string;
  exp?: number;
  iat?: number;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [notification, setNotification] = useState<IMessages[]>([]);
  const [user, setUser] = useState<IUser | null>(() => {
    const accessToken = Cookies.get(COOKIES.ACCESS_TOKEN);
    if (!accessToken) return null;

    try {
      const decoded: TokenPayload = jwtDecode(accessToken);
      return {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      };
    } catch (err) {
      console.warn("Invalid token, clearing cookies", err);
      Cookies.remove(COOKIES.ACCESS_TOKEN);
      return null;
    }
  });

  const [profile, setProfile] = useState<string | null>(null);

  const login = (accessToken: string) => {
    if (accessToken) {
      Cookies.set(COOKIES.ACCESS_TOKEN, accessToken);

      const decoded: TokenPayload = jwtDecode(accessToken);
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      });
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/profile");
      setProfile(res.data?.avatar || null);
      return res.data?.avatar;
    } catch (err: unknown) {
      if (err instanceof Error) {
      } else {
        console.log("An unknown error occurred");
      }
    } finally {
    }
  };

  const clearProfile = () => {
    setProfile(null);
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/signin"); // or 404
    }
  }, [router, user]);
  const logout = () => {
    if (user?.id) {
      socket.emit("userOffline", user.id);
    }
    Cookies.remove(COOKIES.ACCESS_TOKEN);
    Cookies.remove(COOKIES.REFRESH_TOKEN);
    setUser(null);
    router.push("/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        login,
        profile,
        fetchUserProfile,
        setProfile,
        clearProfile,
        notification,
        setNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

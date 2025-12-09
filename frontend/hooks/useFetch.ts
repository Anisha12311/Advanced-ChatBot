import axios from "axios";
import { useState } from "react";

export const useFetch = () => {
  const [data, setData] = useState<unknown | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApi = async ({
    apiUrl,
    method,
    body,
    config,
  }: {
    apiUrl: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: unknown;
    config?: unknown;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const finalConfig = {
        ...(config || {}),
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };

      let response;
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}api/${apiUrl}`;
      switch (method) {
        case "GET":
          response = await axios.get(url, finalConfig);
          break;
        case "POST":
          response = await axios.post(url, body, finalConfig);
          break;
        case "PUT":
          response = await axios.put(url, body, finalConfig);
          break;
        case "PATCH":
          response = await axios.patch(url, body, finalConfig);
          break;
        case "DELETE":
          response = await axios.delete(url, finalConfig);
          break;
      }

      setData(response.data);
      return response.data;
    } catch (error: unknown) {
      console.log("error test", error);
      if (axios.isAxiosError(error)) {
        setError(
          error?.response?.data?.message
            ? error.response.data?.message
            : error.message
        );
      } else if (error instanceof Error) {
        setError(error?.message);
      } else {
        setError(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { data, loading, error, fetchApi, clearError };
};

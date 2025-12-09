"use client";

import { useFetch } from "@/hooks/useFetch";
import { StyledTextField } from "@/style/mui/Form.styled";
import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface IForm {
  email: string;
}

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>();

  const { fetchApi, loading, error } = useFetch();

  const onSubmit: SubmitHandler<IForm> = async (data) => {
    const forgetPassword = await fetchApi({
      method: "POST",
      apiUrl: "auth/forgetPassword",
      body: data,
    });
    console.log("anilog ~ forgetPassword:", forgetPassword);
    if (forgetPassword && forgetPassword.message) {
      toast.success(forgetPassword.message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    if (!error) return;
    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
    });
  }, [error]);

  return (
    <section className="bg-gray-1 py-16 dark:bg-dark justify-center flex items-center h-full">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="relative mx-auto max-w-[525px] pt-12 pb-12 overflow-hidden rounded-lg bg-white px-10  text-center sm:px-12  dark:bg-dark-2">
              <div className="mb-10 text-center md:mb-10">
                <div
                  className={`cursor-pointer text-2xl font-bold
          text-gray-800 dark:text-gray-100
          hover:text-gray-700 dark:hover:text-gray-200
          transition-colors duration-300
        `}
                >
                  Forget Password
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ width: "100%", gap: "20px", display: "grid" }}>
                  <StyledTextField
                    id="email-basic"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Enter a valid email format.",
                      },
                    })}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ padding: "10px", background: "#1e2939" }}
                    disabled={loading}
                  >
                    {loading ? "Loading...." : "Submit"}
                  </Button>
                </Box>
              </form>

              <p className="text-base text-body-color dark:text-dark-6 mt-5">
                <span className="pr-0.5"> Remembered your password? </span>
                <a href="/signin" className="text-primary hover:underline">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;

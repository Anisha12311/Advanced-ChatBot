"use client";

import { StyledTextField } from "@/style/mui/Form.styled";
import { Box, Button, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "react-toastify";
import { COOKIES } from "@/lib/constant/Storage";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface ILogin {
  email: string;
  password: string;
}

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<ILogin>();

  const { fetchApi, error } = useFetch();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    const loginData = await fetchApi({
      apiUrl: "auth/login",
      method: "POST",
      body: data,
    });
    console.log("loginData", loginData);

    if (loginData) {
      toast.success(loginData.message, {
        position: "top-right",
        autoClose: 5000,
      });
      Cookies.set(COOKIES.ACCESS_TOKEN, loginData?.accessToken, {
        secure: true,
        expires: 7,
      });
      Cookies.set(COOKIES.REFERESH_TOKEN, loginData?.refreshToken, {
        secure: true,
        expires: 7,
      });
      router.push("/dashboard");
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
            <div className="relative mx-auto max-w-[525px] pt-8 pb-8 overflow-hidden rounded-lg bg-white px-10  text-center sm:px-12  dark:bg-dark-2">
              <div className="mb-8 text-center md:mb-8">
                <div
                  className={`cursor-pointer text-2xl font-bold
          text-gray-800 dark:text-gray-100
          hover:text-gray-700 dark:hover:text-gray-200
          transition-colors duration-300
        `}
                >
                  Sign In
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
                  <StyledTextField
                    id="outlined-adornment-password"
                    fullWidth
                    {...register("password", {
                      required: "Password is required",
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showPassword
                                  ? "hide the password"
                                  : "display the password"
                              }
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    label="Password"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ padding: "10px", background: "#1e2939" }}
                  >
                    Submit
                  </Button>
                </Box>
              </form>

              <a
                href="/forgetpassword"
                className="mt-5 mb-2 inline-block text-base text-dark hover:text-primary hover:underline dark:text-white"
              >
                Forget Password?
              </a>
              <p className="text-base text-body-color dark:text-dark-6">
                <span className="pr-0.5">Not a member yet?</span>
                <a href="/signup" className="text-primary hover:underline">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;

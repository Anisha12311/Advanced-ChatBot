"use client";

import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, InputAdornment } from "@mui/material";
import { StyledTextField } from "@/style/mui/Form.styled";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { PASSWORD_RULES } from "@/lib/constant/Chat";
import CheckIcon from "@mui/icons-material/Check";
import { IForm, PASSWORD_TYPES } from "@/interface/auth";
import { toast } from "react-toastify";
import { COOKIES } from "@/lib/constant/Storage";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IForm>();
  const router = useRouter();
  const { fetchApi, error } = useFetch();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<IForm> = async (data) => {
    const submitData = await fetchApi({
      apiUrl: "auth/register",
      method: "POST",
      body: data,
    });
    console.log("submitData", submitData, error);

    if (submitData) {
      toast.success(submitData.message, {
        position: "top-right",
        autoClose: 5000,
      });
      Cookies.set(COOKIES.ACCESS_TOKEN, submitData?.accessToken, {
        secure: true,
        expires: 7,
      });
      Cookies.set(COOKIES.REFRESH_TOKEN, submitData?.refreshToken, {
        secure: true,
        expires: 7,
      });
      router.push("/signin");
    }
  };
  useEffect(() => {
    if (!error) return;
    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
    });
  }, [error]);

  const password =
    useWatch({
      control,
      name: "password",
    }) ?? "";

  const rules = {
    lowercase: password ? /[a-z]/.test(password) : false,
    uppercase: password ? /[A-Z]/.test(password) : false,
    number: password ? /[0-9]/.test(password) : false,
    length: password ? password.length >= 8 : false,
    special: password ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : false,
  };

  const allPassedRules = Object.values(rules).every(Boolean);

  return (
    <section className="bg-gray-1 mt-4  py-18 dark:bg-dark justify-center flex items-center h-full">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="relative mx-auto max-w-[525px] pt-8 pb-8 overflow-hidden rounded-lg bg-white px-8  text-center sm:px-12  dark:bg-dark-2">
              <div className="mb-7 text-center md:mb-7">
                <div
                  className={`cursor-pointer text-2xl font-bold
          text-gray-800 dark:text-gray-100
          hover:text-gray-700 dark:hover:text-gray-200
          transition-colors duration-300
        `}
                >
                  Sign Up
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ width: "100%", gap: "20px", display: "grid" }}>
                  <StyledTextField
                    id="name-basic"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    {...register("name", { required: "Name is required." })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />

                  <StyledTextField
                    id="email-basic"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Enter a valid email format.",
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                  <StyledTextField
                    id="outlined-adornment-password"
                    fullWidth
                    type={showPassword ? "text" : "password"}
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
                  {password && !allPassedRules && (
                    <>
                      {PASSWORD_RULES?.map((rule) => {
                        const vaild = rules[rule.key as keyof PASSWORD_TYPES];
                        console.log(rule.key, vaild);
                        return (
                          <Box
                            key={rule.key}
                            className="flex justify-self-start"
                          >
                            {vaild ? (
                              <CheckIcon className="text-green-400" />
                            ) : (
                              <CloseIcon className="text-red-400" />
                            )}
                            <Box
                              className={`ml-3 ${
                                vaild ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {rule.label}
                            </Box>
                          </Box>
                        );
                      })}
                    </>
                  )}
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
              <p className="text-base text-body-color dark:text-dark-6 mt-5">
                <span className="pr-0.5"> Already have an account? </span>
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

export default SignUp;

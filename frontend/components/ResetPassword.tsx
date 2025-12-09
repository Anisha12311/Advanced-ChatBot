"use client";

import { StyledTextField } from "@/style/mui/Form.styled";
import { Box, Button, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "react-toastify";
import { PASSWORD_RULES } from "@/lib/constant/Chat";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter, useSearchParams } from "next/navigation";

interface IResetPassword {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const { fetchApi, error } = useFetch();
  const id = searchParams?.get("id");
  const token = searchParams?.get("token");
  const router = useRouter();
  const {
    formState: { errors },
    register,
    handleSubmit,
    control,
  } = useForm<IResetPassword>();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<IResetPassword> = async (data) => {
    console.log("anilog ~ data:", data);
    const { password, confirmPassword } = data;

    if (password !== confirmPassword) {
      toast.error("Password and confirm password must be match", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    if (!id && !token) return;
    const reset = await fetchApi({
      method: "POST",
      apiUrl: `auth/resetPassword?id=${id}&token=${token}`,
      body: data,
    });
    if (reset && reset.message) {
      toast.success(reset.message, {
        position: "top-right",
        autoClose: 5000,
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
                  Reset Password
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ width: "100%", gap: "20px", display: "grid" }}>
                  <StyledTextField
                    id="outlined-adornment-password"
                    fullWidth
                    {...register("password", {
                      required: "New Password is required",
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
                    label="New Password"
                  />

                  <StyledTextField
                    id="outlined-adornment-password"
                    fullWidth
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                    })}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
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
                    label="Confirm Password"
                  />
                  {password && !allPassedRules && (
                    <>
                      {PASSWORD_RULES?.map((rule) => {
                        const vaild = rules[rule.key as keyof typeof rules];
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;

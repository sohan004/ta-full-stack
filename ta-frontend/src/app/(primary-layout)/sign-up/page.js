"use client";
import { useForm } from "react-hook-form";
import bgImg from "../../../../public/download.jpeg";
import { CgSpinner } from "react-icons/cg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Image from "next/image";
import { useState } from "react";
import axiosInstance from "@/axios/axiosInstance";
import { message } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [otpLoading, setOtpLoading] = useState(false);

  const sendOtp = async () => {
    try {
      setOtpLoading(true);
      const email = watch("email");
      if (!email) {
        return toast.error("Email is required");
      }
      await axiosInstance.post("/auth/send-otp", { email });
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.log(error);
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const email = watch("email");
        const otp = watch("otp");
        if (!email || !otp) {
          return toast.error("Email and OTP are required");
        }
        await axiosInstance.post("/auth/verify-otp", { email, otp });
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await verifyOtp();
      await axiosInstance.post("/auth/signup", data);
      const res = await axiosInstance.post("/auth/login", data);
      toast.success(`Welcome, ${res.data.data.name}!`);
      Cookies.set(process.env.NEXT_PUBLIC_ACCESS_TOKEN, res.data.accessToken);
      router.push("/");
    } catch (err) {
      console.log(
        err?.response?.data?.message || err?.message || "An error occurred"
      );
      toast.error(
        err?.response?.data?.message || err?.message || "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-gray-500 to-pink-500 p-4 relative">
      <Image
        className="absolute top-0 left-0 w-full h-full opacity-20 object-cover"
        src={bgImg}
        alt=""
      />

      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 transform transition duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email or Phone
            </label>
            <input
              type="text"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$|^[0-9]{11}$/,
                  message: "Enter a valid email or phone number",
                },
              })}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none`}
              placeholder="Enter your email or phone"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTP
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                {...register("otp", { required: "OTP is required" })}
                className={`w-full flex-1/2 px-4 py-2 border ${
                  errors.otp ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none`}
                placeholder="Enter OTP"
              />
              <button
                onClick={sendOtp}
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg w-[110px] cursor-pointer duration-200 transition-all flex justify-center"
              >
                {otpLoading ? (
                  <CgSpinner className="animate-spin text-2xl" />
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
            {errors.otp && (
              <p className="text-sm text-red-500 mt-1">{errors.otp.message}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none`}
              placeholder="Enter your password"
            />
            <span
              className="absolute right-4 top-10 cursor-pointer text-gray-500"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-800 text-white cursor-pointer font-semibold py-2 px-4 rounded-lg hover:from-blue-800 hover:to-blue-500 focus:ring-2 transition duration-200 flex justify-center items-center"
          >
            {isLoading ? (
              <CgSpinner className="text-xl animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

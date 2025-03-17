"use client";
import React, { useEffect, useState } from "react";
import img from "../../../public/pencil.png";
import Image from "next/image";
import axiosInstance from "@/axios/axiosInstance";
import getInitialsNameWord from "@/utils/getInitialsNameWord";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/slice/authSlice";
import { RiLogoutBoxRFill } from "react-icons/ri";
import logout from "@/utils/logout";


const Nav = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/auth/info");
      setUserData(res.data?.user);
      dispatch(setUser(res.data?.user));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);




  return (
    <div className="px-4 md:px-6 py-3 md:py-5 shadow border-b-2 border-gray-200 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Image src={img} alt="logo" className="w-10" />
        <h1 className="text-xl font-bold">Note</h1>
      </div>
      <div className="flex items-center space-x-3">
        {userData && (
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-400 rounded-full text-white font-semibold">
              {getInitialsNameWord(userData?.name || "Test User")}
            </div>
            <div>
              <p className="font-semibold md:text-lg uppercase">{userData?.name || "Test User"}</p>
              <p
             onClick={() => logout()} 
              className="flex items-center cursor-pointer text-gray-700">Logout <RiLogoutBoxRFill className="text-2xl text-red-600" /></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;

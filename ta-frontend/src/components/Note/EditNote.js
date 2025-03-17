import { useForm } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Image from "next/image";
import { useEffect, useState } from "react";
import axiosInstance from "@/axios/axiosInstance";
import { message } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import img from "../../../public/notes.png";
import { socket } from "@/lib/socketClient";
import { useAppSelector } from "@/redux/hooks";

const EditNote = ({ setContent, data, content , setOpenEdit}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  const onSubmit = async (fromData) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.put(
        `/note/update/${data?._id}`,
        fromData
      );
      setOpenEdit(false);
      socket.emit("update_note", res?.data?.data);
      toast.success("Note updated successfully!");
      setContent(null);
    } catch (err) {
      console.log(err?.response?.data?.message || "An error occurred");
      toast.error(err?.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-base">
      <div className="flex items-center justify-center mb-4 gap-3">
        <Image className="w-12" src={img} alt="notes" />
        <h1 className="text-2xl font-semibold">EDIT NOTE</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block  font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className={`w-full px-4 py-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none`}
            defaultValue={data?.title}
            placeholder="Enter note title"
          />
          {errors.title && (
            <p className=" text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block  font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            {...register("content", { required: "Content is required" })}
            className={`w-full px-4 py-2 border ${
              errors.content ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none`}
            defaultValue={data?.content}
            placeholder="Enter note content"
            rows="5"
          ></textarea>
          {errors.content && (
            <p className=" text-red-500 mt-1">{errors.content.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-800 text-white cursor-pointer font-semibold py-2 px-4 rounded-lg hover:from-blue-800 hover:to-blue-500 focus:ring-2 transition duration-200 flex justify-center items-center"
        >
          {isLoading ? (
            <CgSpinner className="text-xl animate-spin" />
          ) : (
            "Update Note"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditNote;

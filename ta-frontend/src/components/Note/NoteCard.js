import getInitialsNameWord from "@/utils/getInitialsNameWord";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import ModalPage from "../Modal/Modal";
import EditNote from "./EditNote";
import toast from "react-hot-toast";
import axiosInstance from "@/axios/axiosInstance";
import { socket } from "@/lib/socketClient";
import { useAppSelector } from "@/redux/hooks";
import ViewEditors from "./ViewEiditors";

const NoteCard = ({ note }) => {
  const [content, setContent] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
    const [showEditors, setShowEditors] = useState(false);


  const colorCode = [
    "bg-blue-500",
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-blue-600",
    "bg-red-600",
    "bg-green-600",
    "bg-yellow-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-indigo-600",
    "bg-gray-600",
  ];

  const getRandomColor = () => {
    return colorCode[Math.floor(Math.random() * colorCode.length)];
  };

  const clickEdit = () => {
    setOpenEdit(true);
    socket.emit("note_edit_start", {
      noteId: note?._id,
      userInfo: user,
    });
    setContent(
      <EditNote
      openEdit={openEdit}
      setOpenEdit={setOpenEdit}
      content={content} setContent={setContent} data={note} />
    );
  };

  const deleteNote = async () => {
    try {
      await axiosInstance.delete(`/note/delete/${note?._id}`);
      toast.success("Note deleted successfully!");
      socket.emit("delete_note", note?._id);
    } catch (err) {
      console.log(err?.response?.data?.message || "An error occurred");
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (!content && openEdit) {
      socket.emit("note_edit_end", {
        noteId: note?._id,
        userInfo: user,
      });
      setOpenEdit(false);
    }
  }, [content, openEdit]);

  const clickViewEditors = () => {
    setShowEditors(true);
  };

  return (
    <div className=" duration-200 border-2 border-gray-200 shadow hover:shadow-lg rounded-lg p-4">
      <h1 className="text-xl md:text-2xl font-semibold">{note?.title}</h1>
      <p className="break-words md:text-lg mt-0.5 whitespace-pre-wrap text-gray-600 ">
        {note?.content}
      </p>

      <div className="sticky top-full flex flex-col md:flex-row md:items-center md:justify-between gap-3  mt-4">
        <div className="flex items-center gap-2">
          <div
            className={`${getRandomColor()} text-white text-xl flex justify-center items-center rounded-full w-10 h-10`}
          >
            {getInitialsNameWord(note?.author?.name)}
          </div>
          <div>
            <p className="font-semibold">{note?.author?.name}</p>
            <p className="break-words whitespace-pre-wrap text-gray-600 text-sm">
              {dayjs(note?.createdAt).format("DD MMMM, YYYY")}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 text-lg text-gray-500">
          <FaRegEye onClick={clickViewEditors} className="cursor-pointer" />
          <MdEdit onClick={clickEdit} className="cursor-pointer" />
          <MdDelete
            onClick={(e) => {
              toast((t) => (
                <span className="">
                  Are you sure,
                  <button
                    className="text-white bg-red-600 cursor-pointer px-3 py-1 rounded-md ml-2"
                    onClick={() => {
                      toast.dismiss(t.id);
                      deleteNote();
                    }}
                  >
                    Yes Delete
                  </button>
                </span>
              ));
            }}
            className="cursor-pointer"
          />
        </div>
      </div>
      <ModalPage content={content} setContent={setContent} />
      <ViewEditors
        editors={note?.editors}
        showEditors={showEditors}
        setShowEditors={setShowEditors}
      />
    </div>
  );
};

export default NoteCard;

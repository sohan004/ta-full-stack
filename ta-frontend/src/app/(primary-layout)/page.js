"use client";
import axiosInstance from "@/axios/axiosInstance";
import ModalPage from "@/components/Modal/Modal";
import Nav from "@/components/Nav/Nav";
import AddNote from "@/components/Note/AddNote";
import React, { useEffect, useState } from "react";
import { LuCopyPlus } from "react-icons/lu";
import dayjs from "dayjs";
import getInitialsNameWord from "@/utils/getInitialsNameWord";
import NoteCard from "@/components/Note/NoteCard";
import { socket } from "@/lib/socketClient";
import { Skeleton } from "antd";
import img from "../../../public/planet.png";
import Image from "next/image";

const Page = () => {
  const [content, setContent] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleAdd = () => {
    setContent(
      React.cloneElement(
        <AddNote content={content} setContent={setContent} />,
        { key: Date.now() }
      )
    );
  };

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/note/get-all");
      setNotes(res?.data?.data);
    } catch (err) {
      console.log(err?.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    console.log(notes);

    socket.on("new_note", (data) => {
      setNotes((prev) => [data, ...notes]);
    });

    socket.on("update_note", (data) => {
      console.log(data);
      setNotes((prev) =>
        notes.map((note) =>
          note._id === data._id
            ? {
                editors: note.editors?.filter(
                  (editor) => editor._id !== data?.author?._id
                ),
                ...data,
              }
            : note
        )
      );
    });

    socket.on("delete_note", (id) => {
      setNotes((prev) => notes.filter((note) => note._id !== id));
    });

    socket.on("note_edit_start", (data) => {
      console.log(data);
      setNotes((prev) => {
        return notes.map((note) => {
          if (note._id === data.noteId) {
            return { ...note, editors: [...note.editors, data] };
          }
          return note;
        });
      });
    });

    socket.on("note_edit_end", (data) => {
      setNotes((prev) => {
        return notes.map((note) => {
          if (note._id === data.noteId) {
            return {
              ...note,
              editors: note.editors.filter((editor) => editor._id !== data._id),
            };
          }
          return note;
        });
      });
    });

    socket.on("disconnectUser", (socketId) => {
      setNotes((prev) => {
        return notes.map((note) => {
          return {
            ...note,
            editors: note.editors.filter(
              (editor) => editor.socketId !== socketId
            ),
          };
        });
      });
    });

    return () => {
      socket.off("new_note");
      socket.off("update_note");
      socket.off("delete_note");
      socket.off("note_edit_start");
      socket.off("note_edit_end");
      socket.off("disconnectUser");
    };
  }, [socket, notes]);
  /*  */
  return (
    <div>
      <div className="h-screen overflow-hidden flex flex-col w-full gap-2 md:gap-4">
        <div>
          <Nav />
        </div>
        <div className="flex-1/2 overflow-y-auto relative">
          {!isLoading && notes?.length === 0 && (
            <Image
              className="max-w-[500px] mx-auto p-4 mt-5 w-full"
              src={img}
              alt="notes"
            />
          )}

          <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note) => (
              <NoteCard note={note} key={note?._id} />
            ))}
            {isLoading &&
              new Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton.Node
                    key={i}
                    active={true}
                    style={{ width: "100%" }}
                  />
                ))}
          </div>

          <div
            onClick={handleAdd}
            className="bg-blue-500 w-fit text-white text-4xl rounded p-3 cursor-pointer fixed bottom-10 right-10 h-fit shadow-lg"
          >
            <LuCopyPlus />
          </div>
        </div>
      </div>
      <ModalPage content={content} setContent={setContent} />
    </div>
  );
};

export default Page;

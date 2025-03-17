import React from "react";
import { IoMdClose } from "react-icons/io";

const ViewEditors = ({ editors, setShowEditors, showEditors }) => {
  console.log(editors);
  return (
    <div>
      <div
        onClick={() => setShowEditors(false)}
        className={`z-50 fixed top-0 left-0 w-full h-full bg-black duration-300  opacity-25 invisible ${
          showEditors ? "visible opacity-25" : "invisible opacity-0"
        }`}
      ></div>
      <div
        className={`fixed top-2/4 z-50 left-2/4 overflow-hidden -translate-x-2/4 -translate-y-2/4 bg-white  max-w-[90%] md:max-w-[400px] w-full  rounded  duration-200  ${
          showEditors
            ? "scale-100 opacity-100 visible"
            : "scale-75 opacity-0 invisible"
        } p-4 md:p-6 pb-6 md:pb-10`}
      >
        <IoMdClose
          onClick={() => setShowEditors(false)}
          className="absolute top-3 right-3 text-xl cursor-pointer"
        />

        {
          <div className="mb-4">
            <h3 className="text-2xl font-semibold font-medium text-gray-700 mb-2">
              Editors <span className="text-red-400">({editors.length})</span>
            </h3>
            <ul className="list-disc pl-5 mt-5">
              {editors.map((editor) => (
                <li
                  key={editor._id}
                  className="text-gray-600 md:text-lg mt-1.5"
                >
                  {editor.name} ({editor.email})
                </li>
              ))}
            </ul>
          </div>
        }

        {editors?.length === 0 && <p className="text-lg text-center text-gray-600">
            No editors found for this note
        </p> }
      </div>
    </div>
  );
};

export default ViewEditors;

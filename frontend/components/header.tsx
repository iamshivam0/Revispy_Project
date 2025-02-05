import React from "react";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";

const header = () => {
  return (
    <div>
      <div className="header p-2 bg-[#f4f4f4] justify-center items-center flex">
        <BsArrowLeftShort className="w-6 h-6 cursor-pointer hover:text-gray-700 transition-colors" />
        <h1 className="mx-3 text-sm font-medium">
          Get 10% Off Business Sign up
        </h1>
        <BsArrowRightShort className="w-6 h-6 cursor-pointer hover:text-gray-700 transition-colors" />
      </div>
    </div>
  );
};

export default header;

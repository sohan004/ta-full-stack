"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  return (
    <div>
      <AntdRegistry>
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </AntdRegistry>
    </div>
  );
};

export default Layout;

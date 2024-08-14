import React from "react";

const Layout = ({ children }: any) => {
  return (
    <div className="grid px-4 gap-x-[40px] mt-[40px] app_md:center-col app_md:!flex-col-reverse app_sm:center-col app_sm:!flex-col-reverse grid-cols-[1.4fr_1fr] !w-full grid-rows-[100vh]">
      {children}
    </div>
  );
};

export default Layout;

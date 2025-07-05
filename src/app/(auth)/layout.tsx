import React, { ReactNode } from "react";

const PrivateLayout = ({ children }: { children: ReactNode }) => {
  return (
      <div className="bg-gray-100 w-screen h-screen p-4 flex items-center justify-center">
        {children}
      </div>
  );
};

export default PrivateLayout;

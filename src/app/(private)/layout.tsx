import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/header/Header";
import React, { ReactNode } from "react";

const PrivateLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthGuard>
        <div className="flex flex-col h-screen w-screen">
          <Header />
          <div className="flex-1 bg-gray-100 p-4 overflow-hidden">{children}</div>
        </div>
    </AuthGuard>
  );
};

export default PrivateLayout;

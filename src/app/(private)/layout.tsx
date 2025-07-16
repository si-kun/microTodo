import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/header/Header";
import React, { ReactNode } from "react";

const PrivateLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthGuard>
        <div className="flex flex-col h-screen">
          <Header />
          <div className="bg-gray-100 w-screen h-full pt-4">{children}</div>
        </div>
    </AuthGuard>
  );
};

export default PrivateLayout;

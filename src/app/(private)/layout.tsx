import AuthGuard from "@/components/auth/AuthGuard";
import React, { ReactNode } from "react";

const PrivateLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthGuard>
      <div className="bg-gray-100 w-screen h-screen  p-4">{children}</div>
    </AuthGuard>
  );
};

export default PrivateLayout;

"use client";

import React from "react";
import Menu from "../menu/AppSidebar";
import { SidebarTrigger } from "../ui/sidebar";
import TodoDialog from "../addTodoDialog/TodoDialog";

const Header = () => {
  return (
    <header className="bg-indigo-100 w-full p-4 flex items-center justify-between">
      <SidebarTrigger />
      <TodoDialog mode="create" />
      <Menu />
    </header>
  );
};

export default Header;

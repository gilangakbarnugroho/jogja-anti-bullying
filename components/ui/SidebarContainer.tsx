"use client";

import Sidebar from "./Sidebar"; 
import { useState } from "react";

const SidebarContainer = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
  );
};

export default SidebarContainer;

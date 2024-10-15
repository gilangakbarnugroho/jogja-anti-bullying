"use client";

import Sidebar from "./Sidebar"; // Import Sidebar
import { useState } from "react";

// Kontainer untuk sidebar yang mengontrol state expand/collapse
const SidebarContainer = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Fungsi untuk toggle expand/collapse sidebar
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
  );
};

export default SidebarContainer;

"use client";

import CreateChannelsModal from "@/features/channels/components/create-channel-modal";
import CreateWorkSpaceModal from "@/features/workspaces/components/create-workspace-modal";
import { useEffect, useState } from "react";

const Modals = () => {
  // preventing hydration error

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateChannelsModal />
      <CreateWorkSpaceModal />
    </>
  );
};

export default Modals;

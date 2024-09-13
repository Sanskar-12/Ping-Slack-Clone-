"use client";

import UserButton from "@/features/auth/components/user-button";
import { useCreateWorkSpaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkSpaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const { data, isLoading } = useGetWorkSpaces();
  const [open, setOpen] = useCreateWorkSpaceModal();

  const workSpaceId = useMemo(() => {
    return data?.[0]?._id;
  }, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workSpaceId) {
      router.replace(`/workspace/${workSpaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workSpaceId, isLoading, open, setOpen, router]);

  return (
    <div>
      Logged in
      <UserButton />
    </div>
  );
};

export default Home;

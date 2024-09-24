"use client";

import { Button } from "@/components/ui/button";
import { useGetWorkSpaceInfoById } from "@/features/workspaces/api/use-get-workspace-info";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useWorkSpaceId } from "@/features/workspaces/api/use-workspace-id";
import { cn } from "@/lib/utils";
import { Loader, Undo2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";

const JoinPage = () => {
  const router = useRouter();

  const workspaceId = useWorkSpaceId();
  const { data, isLoading } = useGetWorkSpaceInfoById({ id: workspaceId });
  const { mutate, isPending } = useNewJoinCode();

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [router, workspaceId, isMember]);

  const handleComplete = (value: string) => {
    mutate(
      {
        id: workspaceId,
        joinCode: value,
      },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`);
          toast.success("Workspace joined.");
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-8 rounded-lg bg-white p-8 shadow-md">
      <Image src={"/logo.svg"} alt="Logo" height={60} width={60} />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          length={6}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed pointer-events-none"
            ),
            character:
              "uppercase h-auto rounded-md border border-gray-300 outline-rose-500 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4">
        <Button size={"lg"} variant={"outline"} asChild>
          <Link href={"/"}>
            <Undo2 className="mr-2 size-4" /> Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;

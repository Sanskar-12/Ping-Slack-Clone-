"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDeleteChannel } from "@/features/channels/api/use-delete-channel";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/features/channels/api/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-members";
import { useWorkSpaceId } from "@/features/workspaces/api/use-workspace-id";
import useConfirm from "@/hooks/use-confirm";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

interface HeaderProps {
  name: string;
}

const Header = ({ name }: HeaderProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkSpaceId();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete this channel?",
    message:
      "You are about to delete this channel. This action is irreversible",
  });
  const { data: member } = useCurrentMember({ workspaceId });

  const [value, setValue] = useState(name);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: deleteChannel, isPending: isDeletingChannel } =
    useDeleteChannel();

  const handleEditOpen = (value: boolean) => {
    if (member && member.role !== "admin") return;

    setEditOpen(value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      {
        channelId,
        workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success("Channel name updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel");
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    deleteChannel(
      {
        channelId,
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Channel deleted");
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"ghost"}
              className="text-lg font-semibold px-2 overflow-hidden w-auto"
              size={"sm"}
            >
              <span className="truncate"># {name}</span>
              <FaChevronDown className="size-2.5 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {name}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel name</p>
                      {member?.role === "admin" && (
                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                          Edit
                        </p>
                      )}
                    </div>
                    <p className="text-sm"># {name}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this channel</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <Input
                      value={value}
                      disabled={isUpdatingChannel}
                      onChange={handleChange}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="e.g. plan-budget"
                    />
                  </form>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant={"outline"} disabled={isUpdatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingChannel}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {member?.role === "admin" && (
                <button
                  className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                  onClick={handleDelete}
                  disabled={isDeletingChannel}
                >
                  <TrashIcon className="size-4" />
                  <p className="text-sm font-semibold">Delete Channel</p>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Header;

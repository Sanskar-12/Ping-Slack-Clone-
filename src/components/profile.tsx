import { useGetMembersById } from "@/features/members/api/use-get-by-id-member";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ChevronDown,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { useWorkSpaceId } from "@/features/workspaces/api/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-members";
import { useUpdateMember } from "@/features/members/api/use-update-members";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { toast } from "sonner";
import useConfirm from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

const Profile = ({ memberId, onClose }: ProfileProps) => {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();

  const [ConfirmRemoveDialog, confirmRemove] = useConfirm({
    title: "Remove Member",
    message:
      "Are you sure you want to remove this member? This cannot be undone",
  });
  const [ConfirmLeaveDialog, confirmLeave] = useConfirm({
    title: "Leave the workspace",
    message:
      "Are you sure you want to leave the workspace? This cannot be undone",
  });
  const [ConfirmChangeRoleDialog, confirmChangeRole] = useConfirm({
    title: "Change the role",
    message:
      "Are you sure you want to change the role of this member? This cannot be undone",
  });

  const { data: currentMember, isLoading: currentMemberLoading } =
    useCurrentMember({ workspaceId });

  const { data: member, isLoading: isLoadingMember } = useGetMembersById({
    memberId,
  });

  const { mutate: updateMember } =
    useUpdateMember();
  const { mutate: deleteMember } =
    useDeleteMember();

  const fallback = member ? member?.user.name?.charAt(0).toUpperCase() : "M";

  const onRemoveMember = async () => {
    const ok = await confirmRemove();

    if (!ok) return;
    deleteMember(
      {
        memberId,
      },
      {
        onSuccess: () => {
          toast.success("Member Deleted");
          onClose();
        },
        onError: () => {
          toast.error("Failed to delete Member");
        },
      }
    );
  };

  const onLeaveMember = async () => {
    const ok = await confirmLeave();

    if (!ok) return;
    deleteMember(
      {
        memberId,
      },
      {
        onSuccess: () => {
          toast.success("You left the workspace");
          router.push("/");

          onClose();
        },
        onError: () => {
          toast.error("Failed to leave the workspace");
        },
      }
    );
  };

  const onRoleChange = async (role: "admin" | "member") => {
    if (member?.role === role) return;

    const ok = await confirmChangeRole();

    if (!ok) return;
    updateMember(
      {
        memberId,
        role,
      },
      {
        onSuccess: () => {
          toast.success("Role changed.");
        },
        onError: () => toast.error("Failed to change role."),
      }
    );
  };

  if (isLoadingMember || currentMemberLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="animate-spin size-5  text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  if (!member) {
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-5  text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Profile not found</p>
      </div>
    </div>;
  }

  return (
    <>
      <ConfirmRemoveDialog />
      <ConfirmLeaveDialog />
      <ConfirmChangeRoleDialog />
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarImage src={member?.user?.image} />
            <AvatarFallback className="aspect-square text-6xl">
              {fallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4 items-center">
          <p className="text-xl font-bold">{member?.user.name}</p>
          {currentMember?.role === "admin" &&
            member?.role === "admin" &&
            currentMember._id !== memberId && (
              <div className="flex items-center gap-2 mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} className="w-full capitalize">
                      {member?.role} <ChevronDown className="size-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={member?.role}
                      onValueChange={(value) =>
                        onRoleChange(value as "admin" | "member")
                      }
                    >
                      <DropdownMenuRadioItem value="admin">
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="member">
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          {currentMember?.role === "admin" &&
          member?.role !== "admin" &&
          currentMember._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className="w-full capitalize">
                    {member?.role} <ChevronDown className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={member?.role}
                    onValueChange={(value) =>
                      onRoleChange(value as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant={"outline"}
                className="w-full"
                onClick={onRemoveMember}
              >
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember.role !== "admin" ? (
            <div className="mt-4">
              <Button
                variant={"outline"}
                className="w-full"
                onClick={onLeaveMember}
              >
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact Information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member?.user.email}`}
                className="text-sm hover:underline text-[#1264a3]"
              >
                {member?.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

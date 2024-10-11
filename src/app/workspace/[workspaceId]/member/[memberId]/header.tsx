"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick: () => void;
}

const Header = ({
  memberImage,
  memberName = "Member",
  onClick,
}: HeaderProps) => {
  const avatarFallback = memberName.charAt(0).toUpperCase();

  return (
    <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
      <Button
        variant={"ghost"}
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        size={"sm"}
        onClick={onClick}
      >
        <Avatar className="mr-2 size-6">
          <AvatarImage src={memberImage} alt="Member Image" />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="ml-2 size-2.5" />
      </Button>
    </div>
  );
};

export default Header;

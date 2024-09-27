import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

interface ChannelLayoutProps {
  children: ReactNode;
}

const ChannelLayout = ({ children }: ChannelLayoutProps) => {
  return (
    <div className="h-full">
      <Toaster />
      {children}
    </div>
  );
};

export default ChannelLayout;

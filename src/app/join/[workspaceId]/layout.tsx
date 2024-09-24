import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

interface JoinLayoutProps {
  children: ReactNode;
}

const JoinLayout = ({ children }: JoinLayoutProps) => {
  return (
    <div className="h-full">
      <Toaster />
      {children}
    </div>
  );
};

export default JoinLayout;

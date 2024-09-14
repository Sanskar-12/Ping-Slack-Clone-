"use client"

import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { Id } from "../../../../convex/_generated/dataModel";

interface WorkSpaceIdPageProps {
  params: {
    workspaceId: Id<"workspaces">;
  };
}

const WorkSpaceIdPage = ({ params: { workspaceId } }: WorkSpaceIdPageProps) => {
  const {data}=useGetWorkSpace({id:workspaceId})

  console.log(data)

  return <div>WorkSpaceIdPage :{workspaceId}</div>;
};

export default WorkSpaceIdPage;

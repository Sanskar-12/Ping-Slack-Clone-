"use client"

import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkSpaceId } from "@/features/workspaces/api/use-workspace-id";


const WorkSpaceIdPage = () => {
  const workspaceId=useWorkSpaceId()
  const {data}=useGetWorkSpace({id:workspaceId})

  return <div>WorkSpaceIdPage :{workspaceId}</div>;
};

export default WorkSpaceIdPage;

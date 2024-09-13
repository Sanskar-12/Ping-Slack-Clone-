interface WorkSpaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkSpaceIdPage = ({ params: { workspaceId } }: WorkSpaceIdPageProps) => {
  return <div>WorkSpaceIdPage :{workspaceId}</div>;
};

export default WorkSpaceIdPage;

import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface useGetMembersByIdProps {
  memberId: Id<"members">;
}

export const useGetMembersById = ({ memberId }: useGetMembersByIdProps) => {
  const data = useQuery(api.members.getById, { memberId });
  const isLoading = data === undefined;

  return { data, isLoading };
};

import { useQueryState } from "nuqs";
// This package will help me getting sync with my parentMessageId state if my value of parentMessageId in the query url changes

export const useParentMessageId = () => {
  return useQueryState("parentMessageId");
};

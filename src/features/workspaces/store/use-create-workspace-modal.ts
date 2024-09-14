// jotai is a state management tool like redux or zustand
import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateWorkSpaceModal = () => {
  return useAtom(modalState);
};

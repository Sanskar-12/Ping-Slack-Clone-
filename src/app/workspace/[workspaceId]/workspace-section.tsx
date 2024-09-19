import { ReactNode } from "react"

interface WorkspaceSectionProps {
    children:ReactNode,
    label:string,
    hint:string,
    onNew?:()=>void
}

const WorkspaceSection = ({
    children,
    label,
    hint,
    onNew
}:WorkspaceSectionProps) => {
  return (
    <div>{children}</div>
  )
}

export default WorkspaceSection
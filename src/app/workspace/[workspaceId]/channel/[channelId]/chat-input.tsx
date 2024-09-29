import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef } from "react"

// cant use the quill in server side because quill doesnt support server side rendering and nextjs does ssr so we have do dynamic import by doing ssr = false
const Editor=dynamic(()=>import("@/components/editor"),{ssr:false}) 

interface ChatInputProps {
  placeholder:string
}
 
const ChatInput = ({
  placeholder
}:ChatInputProps) => {
  const editorRef=useRef<Quill | null>(null)

  return (
    <div className="px-5 w-full">
        <Editor 
          variant="create"
          placeholder={placeholder}
          onSubmit={()=>{}}
          disabled={false}
          innerRef={editorRef}
        />
    </div>
  )
}

export default ChatInput